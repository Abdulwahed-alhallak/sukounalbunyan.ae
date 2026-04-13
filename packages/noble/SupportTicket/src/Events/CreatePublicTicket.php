<?php

namespace Noble\SupportTicket\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\SupportTicket\Models\Ticket;

class CreatePublicTicket
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Ticket $ticket
    ) {}
}