<?php

namespace Noble\Calendar\Providers;

use App\Events\DefaultData;
use App\Events\GivePermissionToRole;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Appointment\Events\AppointmentStatus;
use Noble\Lead\Events\CreateDealTask;
use Noble\Lead\Events\CreateLeadTask;
use Noble\CMMS\Events\CreateWorkOrder;
use Noble\Contract\Events\CreateContract;
use Noble\GoogleMeet\Events\CreateGoogleMeeting;
use Noble\HospitalManagement\Events\UpdateHospitalAppointmentStatus;
use Noble\Sales\Events\CreateSalesCall;
use Noble\ZoomMeeting\Events\CreateZoomMeeting;
use Noble\Sales\Events\CreateSalesMeeting;
use Noble\School\Events\CreateEvent;
use Noble\Taskly\Events\CreateProjectTask;
use Noble\ToDo\Events\CreateToDo;
use Noble\TeamWorkload\Events\CreateTeamWorkloadHoliday;
use Noble\Recruitment\Events\CreateInterview;
use Noble\Hrm\Events\CreateLeaveApplication;
use Noble\Hrm\Events\CreateEvent as HrmCreateEvent;
use App\Events\CreateSalesInvoice;
use App\Events\CreatePurchaseInvoice;

use Noble\Calendar\Listeners\CreateDealTaskLis;
use Noble\Calendar\Listeners\CreateLeadTaskLis;
use Noble\Calendar\Listeners\CreateWorkorderLis;
use Noble\Calendar\Listeners\CreateAppointmentStatusListener;
use Noble\Calendar\Listeners\CreateContractListener;
use Noble\Calendar\Listeners\CreateGoogleMeetingListener;
use Noble\Calendar\Listeners\CreateHospitalAppointmentListener;
use Noble\Calendar\Listeners\CreateSalesCallListener;
use Noble\Calendar\Listeners\CreateZoomMeetingListener;
use Noble\Calendar\Listeners\CreateSalesMeetingListener;
use Noble\Calendar\Listeners\CreateSchoolEventListener;
use Noble\Calendar\Listeners\CreateProjectTaskListener;
use Noble\Calendar\Listeners\CreateToDoListener;
use Noble\Calendar\Listeners\CreateTeamWorkloadHolidayListener;
use Noble\Calendar\Listeners\CreateInterviewListener;
use Noble\Calendar\Listeners\CreateLeaveApplicationListener;
use Noble\Calendar\Listeners\CreateEventListener;
use Noble\Calendar\Listeners\CreateSalesInvoiceListener;
use Noble\Calendar\Listeners\CreatePurchaseInvoiceListener;
use Noble\Calendar\Listeners\DataDefault;
use Noble\Calendar\Listeners\GiveRoleToPermission;


class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        DefaultData::class => [
            DataDefault::class,
        ],
        GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
        CreateDealTask::class => [
            CreateDealTaskLis::class,
        ],
        CreateLeadTask::class => [
            CreateLeadTaskLis::class,
        ],
        CreateWorkOrder::class => [
            CreateWorkorderLis::class,
        ],
        AppointmentStatus::class => [
            CreateAppointmentStatusListener::class,
        ],
        CreateContract::class => [
            CreateContractListener::class,
        ],
        CreateGoogleMeeting::class => [
            CreateGoogleMeetingListener::class,
        ],
        UpdateHospitalAppointmentStatus::class => [
            CreateHospitalAppointmentListener::class,
        ],
        CreateZoomMeeting::class => [
            CreateZoomMeetingListener::class,
        ],
        CreateSalesCall::class => [
            CreateSalesCallListener::class,
        ],
        CreateSalesMeeting::class => [
            CreateSalesMeetingListener::class,
        ],
        CreateEvent::class => [
            CreateSchoolEventListener::class,
        ],
        CreateProjectTask::class => [
            CreateProjectTaskListener::class,
        ],
        CreateToDo::class => [
            CreateToDoListener::class,
        ],
        CreateTeamWorkloadHoliday::class => [
            CreateTeamWorkloadHolidayListener::class,
        ],
        CreateInterview::class => [
            CreateInterviewListener::class,
        ],
        CreateLeaveApplication::class => [
            CreateLeaveApplicationListener::class,
        ],
        HrmCreateEvent::class => [
            CreateEventListener::class,
        ],
        CreateSalesInvoice::class => [
            CreateSalesInvoiceListener::class,
        ],
        CreatePurchaseInvoice::class => [
            CreatePurchaseInvoiceListener::class,
        ],
    ];
}
