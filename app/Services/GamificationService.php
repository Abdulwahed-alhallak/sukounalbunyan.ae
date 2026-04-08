<?php

namespace App\Services;

use App\Models\GamificationPoint;
use App\Models\GamificationRule;
use App\Models\User;

class GamificationService
{
    /**
     * Tiers definition based on user feedback.
     */
    const TIERS = [
        'Bronze'   => 0,
        'Silver'   => 500,
        'Gold'     => 2000,
        'Platinum' => 5000,
        'Diamond'  => 10000,
    ];

    /**
     * Award points to a user based on a specific event name.
     */
    public static function awardPoints(int $userId, string $eventName, ?int $companyId = null): void
    {
        $rule = GamificationRule::where('event_name', $eventName)->where('is_active', true)->first();

        if (!$rule) {
            return; // Rule does not exist or is inactive
        }

        // Try to automatically determine company ID if missing
        if (is_null($companyId)) {
            $user = User::find($userId);
            if ($user) {
                $companyId = $user->type === 'company' ? $user->id : $user->created_by;
            }
        }

        $gamification = GamificationPoint::firstOrCreate(
            ['user_id' => $userId],
            ['company_id' => $companyId, 'points' => 0, 'level' => 1, 'tier' => 'Bronze']
        );

        $gamification->points += $rule->points_reward;
        
        // Recalculate Tier and Level
        $gamification->tier = self::calculateTier($gamification->points);
        $gamification->level = self::calculateLevel($gamification->points);
        
        $gamification->save();
    }

    /**
     * Calculate Tier based on accumulated points.
     */
    private static function calculateTier(int $points): string
    {
        $currentTier = 'Bronze';
        foreach (self::TIERS as $tier => $threshold) {
            if ($points >= $threshold) {
                $currentTier = $tier;
            }
        }
        return $currentTier;
    }

    /**
     * Calculate Level based on points. Arbitrary formula: 1 level per 100 points
     */
    private static function calculateLevel(int $points): int
    {
        // Start from Level 1
        return 1 + floor($points / 100);
    }
}
