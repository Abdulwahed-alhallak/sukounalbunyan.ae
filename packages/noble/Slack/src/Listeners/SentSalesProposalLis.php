<?php

namespace Noble\Slack\Listeners;

use App\Events\SentSalesProposal;
use Noble\Slack\Services\SendMsg;

class SentSalesProposalLis
{
    public function __construct()
    {
        //
    }

    public function handle(SentSalesProposal $event)
    {
        if (company_setting('Slack Sales Proposal Status Updated') == 'on') {
            $uArr = [];
            SendMsg::SendMsgs($uArr, 'Sales Proposal Status Updated');
        }
    }
}