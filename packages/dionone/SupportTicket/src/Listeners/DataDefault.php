<?php

namespace DionONE\SupportTicket\Listeners;

use App\Events\DefaultData;
use DionONE\SupportTicket\Models\TicketField;
use DionONE\SupportTicket\Models\SupporUtility;

class DataDefault
{
    public function handle(DefaultData $event)
    {
        $company_id = $event->company_id;
        $user_module = $event->user_module ? explode(',', $event->user_module) : [];
        
        if (!empty($user_module) && in_array("SupportTicket", $user_module)) {
            TicketField::defaultdata($company_id);
            SupporUtility::defaultdata($company_id);
        }
    }
}