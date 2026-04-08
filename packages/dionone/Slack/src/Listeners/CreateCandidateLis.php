<?php

namespace DionONE\Slack\Listeners;

use DionONE\Recruitment\Events\CreateCandidate;
use DionONE\Slack\Services\SendMsg;

class CreateCandidateLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCandidate $event)
    {
        $candidate = $event->candidate;

        if (company_setting('Slack New Candidate') == 'on') {
            $uArr = [
                'user_name' => $candidate->first_name . ' ' . $candidate->last_name,
                'job_name' => $candidate->job_posting ? $candidate->job_posting->title : '-'
            ];

            SendMsg::SendMsgs($uArr, 'New Candidate');
        }
    }
}