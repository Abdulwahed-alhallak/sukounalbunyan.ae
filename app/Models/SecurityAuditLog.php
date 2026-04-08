<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityAuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'event',
        'ip_address',
        'user_agent',
        'browser',
        'os',
        'device_type',
        'country',
        'city',
        'is_suspicious',
        'details',
    ];

    protected $casts = [
        'is_suspicious' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record a security event
     */
    public static function record(
        string $event,
        ?int $userId = null,
        ?string $details = null,
        bool $isSuspicious = false
    ): self {
        $request = request();
        $browserData = parseBrowserData($request?->userAgent() ?? '');

        return self::create([
            'user_id' => $userId ?? \Illuminate\Support\Facades\Auth::id(),
            'event' => $event,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'browser' => $browserData['browser_name'],
            'os' => $browserData['os_name'],
            'device_type' => $browserData['device_type'],
            'is_suspicious' => $isSuspicious,
            'details' => $details,
        ]);
    }

    /**
     * Check if login is from a new IP for this user
     */
    public static function isNewIpForUser(int $userId, string $ip): bool
    {
        return !self::where('user_id', $userId)
            ->where('ip_address', $ip)
            ->where('event', 'login')
            ->exists();
    }

    /**
     * Count failed login attempts in last X minutes
     */
    public static function recentFailedAttempts(string $ip, int $minutes = 15): int
    {
        return self::where('ip_address', $ip)
            ->where('event', 'failed_login')
            ->where('created_at', '>=', now()->subMinutes($minutes))
            ->count();
    }

    // Scopes
    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
