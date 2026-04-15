<?php

namespace Noble\SupportTicket\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\TenantBound;

class Faq extends Model
{
    use HasFactory, TenantBound;

    protected $table = 'support_ticket_faqs';
    protected $fillable = [
        'title',
        'description',
        'creator_id',
        'created_by'
    ];
}