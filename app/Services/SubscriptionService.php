<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Order;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * SubscriptionService
 *
 * Handles subscription lifecycle: validation, expiry checks, usage tracking,
 * upgrade/downgrade recommendations, and renewal notifications.
 */
class SubscriptionService
{
    /**
     * Get full subscription status for a company user.
     */
    public static function getStatus(int $userId): array
    {
        $user = User::find($userId);
        if (!$user) return ['status' => 'not_found'];

        $planId = $user->active_plan ?? null;
        $plan = $planId ? Plan::find($planId) : null;

        // Find latest active order
        $latestOrder = Order::where('created_by', $userId)
            ->where('payment_status', 'succeeded')
            ->orderByDesc('created_at')
            ->first();

        // Calculate expiry
        $planExpiry = null;
        $daysRemaining = null;
        $isExpired = false;

        if ($user->plan_expire_date) {
            $planExpiry = Carbon::parse($user->plan_expire_date);
            $daysRemaining = now()->diffInDays($planExpiry, false);
            $isExpired = $daysRemaining < 0;
        }

        // Get subscription type (monthly/yearly/trial)
        $subscriptionType = 'unknown';
        if ($plan && $plan->free_plan) {
            $subscriptionType = 'free';
        } elseif ($plan && $plan->trial) {
            $subscriptionType = 'trial';
        } elseif ($latestOrder) {
            $subscriptionType = str_contains(strtolower($latestOrder->plan_name ?? ''), 'yearly') ? 'yearly' : 'monthly';
        }

        // Usage stats
        $usage = self::getUsageStats($userId, $plan);

        return [
            'status' => $isExpired ? 'expired' : ($daysRemaining !== null && $daysRemaining < 7 ? 'expiring_soon' : 'active'),
            'plan' => $plan ? [
                'id' => $plan->id,
                'name' => $plan->name,
                'price_monthly' => (float) $plan->package_price_monthly,
                'price_yearly' => (float) $plan->package_price_yearly,
                'max_users' => $plan->number_of_users,
                'storage_limit' => $plan->storage_limit,
                'modules' => $plan->modules ?? [],
                'is_trial' => (bool) $plan->trial,
                'is_free' => (bool) $plan->free_plan,
            ] : null,
            'subscription_type' => $subscriptionType,
            'expiry_date' => $planExpiry?->toDateString(),
            'days_remaining' => $daysRemaining,
            'is_expired' => $isExpired,
            'latest_payment' => $latestOrder ? [
                'date' => $latestOrder->created_at->toDateString(),
                'amount' => (float) $latestOrder->price,
                'currency' => $latestOrder->currency,
                'method' => $latestOrder->payment_type,
            ] : null,
            'usage' => $usage,
        ];
    }

    /**
     * Get resource usage vs plan limits.
     */
    public static function getUsageStats(int $companyId, ?Plan $plan): array
    {
        $maxUsers = $plan ? $plan->number_of_users : 0;
        $currentUsers = User::where('created_by', $companyId)->count();

        $maxStorage = $plan ? $plan->storage_limit : 0; // MB
        $currentStorage = 0;
        try {
            $currentStorage = DB::table('media')
                ->where('created_by', $companyId)
                ->sum(DB::raw('COALESCE(size, 0)'));
            $currentStorage = round($currentStorage / (1024 * 1024), 1); // Convert to MB
        } catch (\Exception $e) {
            // media table may not exist
        }

        $enabledModules = $plan ? count($plan->modules ?? []) : 0;
        $totalModules = 28; // Total modules inNobleArchitecture

        return [
            'users' => [
                'current' => $currentUsers,
                'limit' => $maxUsers,
                'percentage' => $maxUsers > 0 ? round(($currentUsers / $maxUsers) * 100, 1) : 0,
            ],
            'storage' => [
                'current_mb' => $currentStorage,
                'limit_mb' => $maxStorage,
                'percentage' => $maxStorage > 0 ? round(($currentStorage / $maxStorage) * 100, 1) : 0,
            ],
            'modules' => [
                'enabled' => $enabledModules,
                'total' => $totalModules,
                'percentage' => round(($enabledModules / $totalModules) * 100, 1),
            ],
        ];
    }

    /**
     * Check all companies for expiring subscriptions and send notifications.
     * Call this from a daily scheduled command.
     */
    public static function checkExpiringSubscriptions(): int
    {
        $count = 0;

        // Find companies with plans expiring in 3 days
        $expiringUsers = User::where('type', 'company')
            ->where('is_disable', 0)
            ->whereNotNull('plan_expire_date')
            ->whereDate('plan_expire_date', '>=', now())
            ->whereDate('plan_expire_date', '<=', now()->addDays(3))
            ->get();

        foreach ($expiringUsers as $user) {
            $daysLeft = now()->diffInDays(Carbon::parse($user->plan_expire_date));
            $plan = Plan::find($user->active_plan);

            UserNotification::send($user->id, 'subscription', "⚠️ Subscription Expiring in {$daysLeft} Day(s)", "Your {$plan?->name} plan expires on {$user->plan_expire_date}. Renew now to avoid service interruption.", [
                'category' => 'warning',
                'action_url' => '/plans',
                'icon' => 'AlertTriangle',
            ]);

            $count++;
        }

        // Find expired subscriptions (expired yesterday)
        $expiredUsers = User::where('type', 'company')
            ->where('is_disable', 0)
            ->whereNotNull('plan_expire_date')
            ->whereDate('plan_expire_date', now()->subDay()->toDateString())
            ->get();

        foreach ($expiredUsers as $user) {
            $plan = Plan::find($user->active_plan);

            UserNotification::send($user->id, 'subscription', "🚫 Subscription Expired", "Your {$plan?->name} plan has expired. Renew to restore full access.", [
                'category' => 'danger',
                'action_url' => '/plans',
                'icon' => 'XCircle',
            ]);

            // Notify superadmins
            UserNotification::sendToSuperAdmins('subscription', "Company subscription expired: {$user->name}", "Plan: {$plan?->name}", [
                'category' => 'warning',
            ]);

            $count++;
        }

        return $count;
    }

    /**
     * Get upgrade recommendations based on usage.
     */
    public static function getUpgradeRecommendations(int $userId): array
    {
        $status = self::getStatus($userId);
        $recommendations = [];

        if (!$status['plan']) return $recommendations;

        $usage = $status['usage'];

        // User limit approaching
        if ($usage['users']['percentage'] >= 80) {
            $recommendations[] = [
                'type' => 'users',
                'severity' => $usage['users']['percentage'] >= 100 ? 'critical' : 'warning',
                'message' => "You're using {$usage['users']['current']}/{$usage['users']['limit']} user slots ({$usage['users']['percentage']}%)",
                'action' => 'Consider upgrading to a plan with more users',
            ];
        }

        // Storage approaching
        if ($usage['storage']['percentage'] >= 80) {
            $recommendations[] = [
                'type' => 'storage',
                'severity' => $usage['storage']['percentage'] >= 95 ? 'critical' : 'warning',
                'message' => "Storage usage: {$usage['storage']['current_mb']}MB / {$usage['storage']['limit_mb']}MB ({$usage['storage']['percentage']}%)",
                'action' => 'Upgrade for more storage or clean up unused files',
            ];
        }

        // Trial ending
        if ($status['plan']['is_trial'] && $status['days_remaining'] !== null && $status['days_remaining'] <= 5) {
            $recommendations[] = [
                'type' => 'trial',
                'severity' => 'important',
                'message' => "Trial expires in {$status['days_remaining']} day(s)",
                'action' => 'Subscribe to a paid plan to keep your data',
            ];
        }

        // Yearly savings
        if ($status['subscription_type'] === 'monthly' && $status['plan']['price_yearly'] > 0) {
            $monthlyCost = $status['plan']['price_monthly'] * 12;
            $yearlyCost = $status['plan']['price_yearly'];
            $savings = $monthlyCost - $yearlyCost;
            if ($savings > 0) {
                $recommendations[] = [
                    'type' => 'savings',
                    'severity' => 'info',
                    'message' => "Save " . number_format($savings, 2) . " annually by switching to yearly billing",
                    'action' => 'Switch to yearly billing',
                ];
            }
        }

        return $recommendations;
    }
}


