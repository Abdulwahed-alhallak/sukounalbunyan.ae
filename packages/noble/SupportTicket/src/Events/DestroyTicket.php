<?php

namespace Noble\SupportTicket\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\SupportTicket\Models\Ticket;

class DestroyTicket
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Ticket $ticket
    ) {}
}