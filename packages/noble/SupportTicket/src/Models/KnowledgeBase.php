<?php

namespace Noble\SupportTicket\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\TenantBound;

class KnowledgeBase extends Model
{
    use HasFactory, TenantBound;

    protected $table = 'support_ticket_knowledge_bases';
    
    protected $fillable = [
        'title',
        'description',
        'content',
        'category',
        'creator_id',
        'created_by'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(KnowledgeBaseCategory::class, 'category');
    }
}