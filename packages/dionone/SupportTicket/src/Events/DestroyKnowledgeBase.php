<?php

namespace DionONE\SupportTicket\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\SupportTicket\Models\KnowledgeBase;

class DestroyKnowledgeBase
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public KnowledgeBase $knowledgeBase
    ) {}
}