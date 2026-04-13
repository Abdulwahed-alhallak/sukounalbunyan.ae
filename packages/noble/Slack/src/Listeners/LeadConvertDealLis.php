<?php

namespace Noble\Slack\Listeners;

use Noble\Lead\Events\LeadConvertDeal;
use Noble\Slack\Services\SendMsg;

class LeadConvertDealLis
{
    public function __construct()
    {
        //
    }

    public function handle(LeadConvertDeal $event)
    {
        $lead = $event->lead;

        if (company_setting('Slack Lead to Deal Conversion') == 'on') {
            $uArr = [
                'name' => $lead->name
            ];

            SendMsg::SendMsgs($uArr, 'Lead to Deal Conversion');
        }
    }
}