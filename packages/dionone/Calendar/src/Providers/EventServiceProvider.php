<?php

namespace DionONE\Calendar\Providers;

use App\Events\DefaultData;
use App\Events\GivePermissionToRole;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use DionONE\Appointment\Events\AppointmentStatus;
use DionONE\Lead\Events\CreateDealTask;
use DionONE\Lead\Events\CreateLeadTask;
use DionONE\CMMS\Events\CreateWorkOrder;
use DionONE\Contract\Events\CreateContract;
use DionONE\GoogleMeet\Events\CreateGoogleMeeting;
use DionONE\HospitalManagement\Events\UpdateHospitalAppointmentStatus;
use DionONE\Sales\Events\CreateSalesCall;
use DionONE\ZoomMeeting\Events\CreateZoomMeeting;
use DionONE\Sales\Events\CreateSalesMeeting;
use DionONE\School\Events\CreateEvent;
use DionONE\Taskly\Events\CreateProjectTask;
use DionONE\ToDo\Events\CreateToDo;
use DionONE\TeamWorkload\Events\CreateTeamWorkloadHoliday;
use DionONE\Recruitment\Events\CreateInterview;
use DionONE\Hrm\Events\CreateLeaveApplication;
use DionONE\Hrm\Events\CreateEvent as HrmCreateEvent;
use App\Events\CreateSalesInvoice;
use App\Events\CreatePurchaseInvoice;

use DionONE\Calendar\Listeners\CreateDealTaskLis;
use DionONE\Calendar\Listeners\CreateLeadTaskLis;
use DionONE\Calendar\Listeners\CreateWorkorderLis;
use DionONE\Calendar\Listeners\CreateAppointmentStatusListener;
use DionONE\Calendar\Listeners\CreateContractListener;
use DionONE\Calendar\Listeners\CreateGoogleMeetingListener;
use DionONE\Calendar\Listeners\CreateHospitalAppointmentListener;
use DionONE\Calendar\Listeners\CreateSalesCallListener;
use DionONE\Calendar\Listeners\CreateZoomMeetingListener;
use DionONE\Calendar\Listeners\CreateSalesMeetingListener;
use DionONE\Calendar\Listeners\CreateSchoolEventListener;
use DionONE\Calendar\Listeners\CreateProjectTaskListener;
use DionONE\Calendar\Listeners\CreateToDoListener;
use DionONE\Calendar\Listeners\CreateTeamWorkloadHolidayListener;
use DionONE\Calendar\Listeners\CreateInterviewListener;
use DionONE\Calendar\Listeners\CreateLeaveApplicationListener;
use DionONE\Calendar\Listeners\CreateEventListener;
use DionONE\Calendar\Listeners\CreateSalesInvoiceListener;
use DionONE\Calendar\Listeners\CreatePurchaseInvoiceListener;
use DionONE\Calendar\Listeners\DataDefault;
use DionONE\Calendar\Listeners\GiveRoleToPermission;


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
