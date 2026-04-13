<?php

namespace Noble\Slack\Listeners;

use Noble\Lead\Events\LeadMoved;
use Noble\Lead\Models\LeadStage;
use Noble\Slack\Services\SendMsg;

class LeadMovedLis
{
    public function __construct()
    {
        //
    }

    public function handle(LeadMoved $event)
    {
        $lead = $event->lead;
        $request = $event->request;
        $newStage = LeadStage::where('id', $request->stage_id)->first();

        if (company_setting('Slack Lead Moved') == 'on') {
            $uArr = [
                'lead_name' => $lead->name,
                'old_stage' => $lead->stage->name,
                'new_stage' => $newStage->name
            ];

            SendMsg::SendMsgs($uArr, 'Lead Moved');
        }
    }
}
