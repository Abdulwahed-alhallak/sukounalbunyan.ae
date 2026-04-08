<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class UserNotification extends Model
{
    protected $fillable = [
        'user_id',
        'company_id',
        'type',
        'category',
        'title',
        'message',
        'icon',
        'action_url',
        'action_label',
        'notifiable_type',
        'notifiable_id',
        'triggered_by',
        'metadata',
        'read_at',
        'archived_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'read_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    // =====================
    // RELATIONSHIPS
    // =====================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function triggeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by');
    }

    // =====================
    // SCOPES
    // =====================

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeNotArchived($query)
    {
        return $query->whereNull('archived_at');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOfCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // =====================
    // HELPERS
    // =====================

    public function markAsRead(): void
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsUnread(): void
    {
        $this->update(['read_at' => null]);
    }

    public function archive(): void
    {
        $this->update(['archived_at' => now()]);
    }

    // =====================
    // FACTORY METHOD
    // =====================

    /**
     * Create a notification for a specific user.
     *
     * @param int $userId         Recipient user ID
     * @param string $type        Notification type (invoice, hrm, crm, project, system)
     * @param string $title       Title text
     * @param string|null $message Detailed message
     * @param array $options      Optional: category, icon, action_url, action_label, notifiable_type, notifiable_id, triggered_by, metadata, company_id
     * @return UserNotification
     */
    public static function send(int $userId, string $type, string $title, ?string $message = null, array $options = []): self
    {
        $companyId = $options['company_id'] ?? null;

        // Auto-detect company_id if not provided
        if (is_null($companyId)) {
            $user = User::find($userId);
            if ($user) {
                $companyId = $user->type === 'company' ? $user->id : $user->created_by;
            }
        }

        return static::create([
            'user_id' => $userId,
            'company_id' => $companyId,
            'type' => $type,
            'category' => $options['category'] ?? 'info',
            'title' => $title,
            'message' => $message,
            'icon' => $options['icon'] ?? null,
            'action_url' => $options['action_url'] ?? null,
            'action_label' => $options['action_label'] ?? null,
            'notifiable_type' => $options['notifiable_type'] ?? null,
            'notifiable_id' => $options['notifiable_id'] ?? null,
            'triggered_by' => $options['triggered_by'] ?? (Auth::check() ? Auth::id() : null),
            'metadata' => $options['metadata'] ?? null,
        ]);
    }

    /**
     * Send notification to all users in a company.
     */
    public static function sendToCompany(int $companyId, string $type, string $title, ?string $message = null, array $options = []): void
    {
        $users = User::where('created_by', $companyId)
            ->orWhere(function ($q) use ($companyId) {
                $q->where('id', $companyId)->where('type', 'company');
            })
            ->pluck('id');

        foreach ($users as $userId) {
            static::send($userId, $type, $title, $message, array_merge($options, ['company_id' => $companyId]));
        }
    }

    /**
     * Send notification to all superadmins.
     */
    public static function sendToSuperAdmins(string $type, string $title, ?string $message = null, array $options = []): void
    {
        $admins = User::where('type', 'superadmin')->pluck('id');

        foreach ($admins as $adminId) {
            static::send($adminId, $type, $title, $message, $options);
        }
    }

    /**
     * Get unread count for a user.
     */
    public static function unreadCount(int $userId): int
    {
        return static::forUser($userId)->notArchived()->unread()->count();
    }
}
