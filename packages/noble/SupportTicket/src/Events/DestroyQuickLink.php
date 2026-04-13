<?php

namespace Noble\SupportTicket\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\SupportTicket\Models\QuickLink;

class DestroyQuickLink
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public QuickLink $quickLink
    ) {}
}