<?php

namespace Noble\SupportTicket\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\SupportTicket\Models\SupportTicketSetting;

class CreateContactInformation
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public SupportTicketSetting $contactInformation
    ) {}
}