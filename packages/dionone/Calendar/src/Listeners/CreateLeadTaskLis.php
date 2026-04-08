<?php

namespace DionONE\Calendar\Listeners;

use DionONE\Lead\Events\CreateLeadTask;
use DionONE\Calendar\Models\CalenderUtility;

class CreateLeadTaskLis
{
    public function handle(CreateLeadTask $event)
    {
        if (module_is_active('Calendar') && $event->request->get('sync_to_google_calendar') == true) {
            $calendarLeadTask = $event->leadTask;
            $calendarRequest = $event->request;
            
            $type = 'lead_task';
            $calendarLeadTask->title = $calendarRequest->name;
            $calendarLeadTask->start_date = $calendarRequest->date . ' ' . $calendarRequest->time;
            $calendarLeadTask->end_date = $calendarRequest->date . ' ' . $calendarRequest->time;

            CalenderUtility::addCalendarData($calendarLeadTask, $type, $calendarLeadTask->created_by);
        }
    }
}
