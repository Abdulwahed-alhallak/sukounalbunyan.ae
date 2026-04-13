<?php

namespace Noble\Twilio\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use App\Events\CreateSalesProposal;
use App\Events\PostSalesInvoice;
use App\Events\SentSalesProposal;
use App\Events\CreatePurchaseInvoice;
use App\Events\CreateUser;
use App\Events\CreateWarehouse;
use App\Events\CreateSalesInvoice;


use Noble\Account\Events\CreateBankTransfer;
use Noble\Account\Events\CreateCustomer;
use Noble\Account\Events\CreateRevenue;
use Noble\Account\Events\CreateVendor;

use Noble\Appointment\Events\AppointmentStatus;
use Noble\Appointment\Events\CreateSchedule;

use Noble\CleaningManagement\Events\CreateCleaningBooking;
use Noble\CleaningManagement\Events\CreateCleaningInvoice;
use Noble\CleaningManagement\Events\CreateCleaningTeam;

use Noble\CMMS\Events\CreateCmmsPos;
use Noble\CMMS\Events\CreateComponent;
use Noble\CMMS\Events\CreateLocation;
use Noble\CMMS\Events\CreatePreventiveMaintenance;
use Noble\CMMS\Events\CreateSupplier;
use Noble\CMMS\Events\CreateWorkOrder;
use Noble\CMMS\Events\CreateWorkRequest;

use Noble\Contract\Events\CreateContract;

use Noble\Documents\Events\CreateDocument;
use Noble\Documents\Events\StatusChangeDocument;

use Noble\Feedback\Events\CreateHistory;
use Noble\Feedback\Events\CreateTemplate;

use Noble\FixEquipment\Events\CreateFixEquipmentAccessory;
use Noble\FixEquipment\Events\CreateFixEquipmentAsset;
use Noble\FixEquipment\Events\CreateFixEquipmentAudit;
use Noble\FixEquipment\Events\CreateFixEquipmentComponent;
use Noble\FixEquipment\Events\CreateFixEquipmentConsumable;
use Noble\FixEquipment\Events\CreateFixEquipmentLicense;
use Noble\FixEquipment\Events\CreateFixEquipmentLocation;
use Noble\FixEquipment\Events\CreateFixEquipmentMaintenance;

use Noble\HospitalManagement\Events\CreateHospitalAppointment;
use Noble\HospitalManagement\Events\CreateHospitalDoctor;
use Noble\HospitalManagement\Events\CreateHospitalMedicine;
use Noble\HospitalManagement\Events\CreateHospitalPatient;

use Noble\Hrm\Events\CreateAnnouncement;
use Noble\Hrm\Events\CreateAward;
use Noble\Hrm\Events\CreateEvent;
use Noble\Hrm\Events\CreateHoliday;
use Noble\Hrm\Events\CreatePayroll;
use Noble\Hrm\Events\UpdateLeaveStatus;

use Noble\InnovationCenter\Events\CreateCategory;
use Noble\InnovationCenter\Events\CreateChallenge;
use Noble\InnovationCenter\Events\CreateCreativity;
use Noble\Internalknowledge\Events\CreateInternalknowledgeArticle;
use Noble\Internalknowledge\Events\CreateInternalknowledgeBook;

use Noble\Lead\Events\CreateDeal;
use Noble\Lead\Events\CreateLead;
use Noble\Lead\Events\DealMoved;
use Noble\Lead\Events\LeadConvertDeal;
use Noble\Lead\Events\LeadMoved;

use Noble\MachineRepairManagement\Events\CreateMachine;
use Noble\MachineRepairManagement\Events\CreateMachineRepairRequest;

use Noble\Notes\Events\CreateNote;

use Noble\Sales\Events\CreateSalesMeeting;
use Noble\Sales\Events\CreateSalesOrder;
use Noble\Sales\Events\CreateSalesQuote;

use Noble\School\Events\CreateAdmission;
use Noble\School\Events\CreateClassTimetable;
use Noble\School\Events\CreateEmployee;
use Noble\School\Events\CreateHomework;
use Noble\School\Events\CreateParent;
use Noble\School\Events\CreateStudent;

use Noble\Taskly\Events\CreateProjectBug;
use Noble\Taskly\Events\CreateProject;
use Noble\Taskly\Events\CreateProjectMilestone;
use Noble\Taskly\Events\CreateProjectTask;
use Noble\Taskly\Events\CreateTaskComment;
use Noble\Taskly\Events\UpdateProjectTaskStage;

use Noble\Timesheet\Events\CreateTimesheet;

use Noble\ToDo\Events\CompleteToDo;
use Noble\ToDo\Events\CreateToDo;

use Noble\Twilio\Listeners\AppointmentStatusLis;
use Noble\Twilio\Listeners\CompleteToDoLis;
use Noble\Twilio\Listeners\CreateAdmissionLis;
use Noble\Twilio\Listeners\CreateAnnouncementLis;
use Noble\Twilio\Listeners\CreateAwardLis;
use Noble\Twilio\Listeners\CreateBankTransferLis;
use Noble\Twilio\Listeners\CreateCategoryLis;
use Noble\Twilio\Listeners\CreateChallengeLis;
use Noble\Twilio\Listeners\CreateClassTimetableLis;
use Noble\Twilio\Listeners\CreateCleaningBookingLis;
use Noble\Twilio\Listeners\CreateCleaningInvoiceLis;
use Noble\Twilio\Listeners\CreateCleaningTeamLis;
use Noble\Twilio\Listeners\CreateCmmsPosLis;
use Noble\Twilio\Listeners\CreateComponentLis;
use Noble\Twilio\Listeners\CreateContractLis;
use Noble\Twilio\Listeners\CreateCreativityLis;
use Noble\Twilio\Listeners\CreateCustomerLis;
use Noble\Twilio\Listeners\CreateDealLis;
use Noble\Twilio\Listeners\CreateDocumentsLis;
use Noble\Twilio\Listeners\CreateEmployeeLis;
use Noble\Twilio\Listeners\CreateEventLis;
use Noble\Twilio\Listeners\CreateFixEquipmentAccessoryLis;
use Noble\Twilio\Listeners\CreateFixEquipmentAssetLis;
use Noble\Twilio\Listeners\CreateFixEquipmentAuditLis;
use Noble\Twilio\Listeners\CreateFixEquipmentComponentLis;
use Noble\Twilio\Listeners\CreateFixEquipmentConsumableLis;
use Noble\Twilio\Listeners\CreateFixEquipmentLicenseLis;
use Noble\Twilio\Listeners\CreateFixEquipmentLocationLis;
use Noble\Twilio\Listeners\CreateFixEquipmentMaintenanceLis;
use Noble\Twilio\Listeners\CreateHistoryLis;
use Noble\Twilio\Listeners\CreateHolidayLis;
use Noble\Twilio\Listeners\CreateHomeworkLis;
use Noble\Twilio\Listeners\CreateHospitalAppointmentLis;
use Noble\Twilio\Listeners\CreateHospitalDoctorLis;
use Noble\Twilio\Listeners\CreateHospitalMedicineLis;
use Noble\Twilio\Listeners\CreateHospitalPatientLis;
use Noble\Twilio\Listeners\CreateInternalknowledgeArticleLis;
use Noble\Twilio\Listeners\CreateInternalknowledgeBookLis;
use Noble\Twilio\Listeners\CreateLeadLis;
use Noble\Twilio\Listeners\CreateLocationLis;
use Noble\Twilio\Listeners\CreateMachineLis;
use Noble\Twilio\Listeners\CreateMachineRepairRequestLis;
use Noble\Twilio\Listeners\CreateNoteLis;
use Noble\Twilio\Listeners\CreateParentLis;
use Noble\Twilio\Listeners\CreatePayrollLis;
use Noble\Twilio\Listeners\CreatePreventiveMaintenanceLis;
use Noble\Twilio\Listeners\CreateProjectBugLis;
use Noble\Twilio\Listeners\CreateProjectLis;
use Noble\Twilio\Listeners\CreateProjectMilestoneLis;
use Noble\Twilio\Listeners\CreateProjectTaskLis;
use Noble\Twilio\Listeners\CreatePurchaseInvoiceLis;
use Noble\Twilio\Listeners\CreateRevenueLis;
use Noble\Twilio\Listeners\CreateSalesInvoiceLis;
use Noble\Twilio\Listeners\CreateSalesMeetingLis;
use Noble\Twilio\Listeners\CreateSalesOrderLis;
use Noble\Twilio\Listeners\CreateSalesProposalLis;
use Noble\Twilio\Listeners\CreateSalesQuoteLis;
use Noble\Twilio\Listeners\CreateScheduleLis;
use Noble\Twilio\Listeners\CreateStudentLis;
use Noble\Twilio\Listeners\CreateSupplierLis;
use Noble\Twilio\Listeners\CreateTaskCommentLis;
use Noble\Twilio\Listeners\CreateTemplateLis;
use Noble\Twilio\Listeners\CreateTimesheetLis;
use Noble\Twilio\Listeners\CreateToDoLis;
use Noble\Twilio\Listeners\CreateUserLis;
use Noble\Twilio\Listeners\CreateVendorLis;
use Noble\Twilio\Listeners\CreateVisitorLis;
use Noble\Twilio\Listeners\CreateVisitPurposeLis;
use Noble\Twilio\Listeners\CreateWarehouseLis;
use Noble\Twilio\Listeners\CreateWoocommerceProductLis;
use Noble\Twilio\Listeners\CreateWorkOrderLis;
use Noble\Twilio\Listeners\CreateWorkRequestLis;
use Noble\Twilio\Listeners\CreateZoomMeetingLis;
use Noble\Twilio\Listeners\DealMovedLis;
use Noble\Twilio\Listeners\LeadConvertDealLis;
use Noble\Twilio\Listeners\LeadMovedLis;
use Noble\Twilio\Listeners\PostSalesInvoiceLis;
use Noble\Twilio\Listeners\SentSalesProposalLis;
use Noble\Twilio\Listeners\StatusChangeDocumentLis;
use Noble\Twilio\Listeners\UpdateLeaveStatusLis;
use Noble\Twilio\Listeners\UpdateProjectTaskStageLis;

use Noble\VisitorManagement\Events\CreateVisitor;
use Noble\VisitorManagement\Events\CreateVisitPurpose;

use Noble\WordpressWoocommerce\Events\CreateWoocommerceProduct;

use Noble\ZoomMeeting\Events\CreateZoomMeeting;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        CreateUser::class                     => [
            CreateUserLis::class,
        ],
        CreateSalesInvoice::class             => [
            CreateSalesInvoiceLis::class
        ],
        PostSalesInvoice::class               => [
            PostSalesInvoiceLis::class
        ],
        CreateSalesProposal::class            => [
            CreateSalesProposalLis::class
        ],
        SentSalesProposal::class              => [
            SentSalesProposalLis::class
        ],
        CreateBankTransfer::class             => [
            CreateBankTransferLis::class
        ],
        CreatePurchaseInvoice::class          => [
            CreatePurchaseInvoiceLis::class
        ],
        CreateWarehouse::class                => [
            CreateWarehouseLis::class
        ],
            // Appointment
        AppointmentStatus::class              => [
            AppointmentStatusLis::class
        ],
        CreateSchedule::class                 => [
            CreateScheduleLis::class
        ],
            // CMMS
        CreateCmmsPos::class                  => [
            CreateCmmsPosLis::class
        ],
        CreateComponent::class                => [
            CreateComponentLis::class
        ],
        CreateLocation::class                 => [
            CreateLocationLis::class
        ],
        CreatePreventiveMaintenance::class    => [
            CreatePreventiveMaintenanceLis::class
        ],
        CreateSupplier::class                 => [
            CreateSupplierLis::class
        ],
        CreateWorkOrder::class                => [
            CreateWorkOrderLis::class
        ],
        CreateWorkRequest::class              => [
            CreateWorkRequestLis::class
        ],
            // contract
        CreateContract::class                 => [
            CreateContractLis::class
        ],
            // lead
        CreateDeal::class                     => [
            CreateDealLis::class
        ],
        CreateLead::class                     => [
            CreateLeadLis::class
        ],
        DealMoved::class                      => [
            DealMovedLis::class
        ],
        LeadConvertDeal::class                => [
            LeadConvertDealLis::class
        ],
        LeadMoved::class                      => [
            LeadMovedLis::class
        ],
            // Sales
        CreateSalesMeeting::class             => [
            CreateSalesMeetingLis::class
        ],
        CreateSalesQuote::class               => [
            CreateSalesQuoteLis::class
        ],
        CreateSalesOrder::class               => [
            CreateSalesOrderLis::class
        ],
            // Taskly
        CreateProjectBug::class               => [
            CreateProjectBugLis::class
        ],
        CreateProject::class                  => [
            CreateProjectLis::class
        ],
        CreateProjectMilestone::class         => [
            CreateProjectMilestoneLis::class
        ],
        CreateProjectTask::class              => [
            CreateProjectTaskLis::class
        ],
        CreateTaskComment::class              => [
            CreateTaskCommentLis::class
        ],
        UpdateProjectTaskStage::class         => [
            UpdateProjectTaskStageLis::class
        ],
            // ZoomMeeting
        CreateZoomMeeting::class              => [
            CreateZoomMeetingLis::class
        ],
            // FixEquipment
        CreateFixEquipmentAccessory::class    => [
            CreateFixEquipmentAccessoryLis::class
        ],
        CreateFixEquipmentAsset::class        => [
            CreateFixEquipmentAssetLis::class
        ],
        CreateFixEquipmentAudit::class        => [
            CreateFixEquipmentAuditLis::class
        ],
        CreateFixEquipmentComponent::class    => [
            CreateFixEquipmentComponentLis::class
        ],
        CreateFixEquipmentConsumable::class   => [
            CreateFixEquipmentConsumableLis::class
        ],
        CreateFixEquipmentLicense::class      => [
            CreateFixEquipmentLicenseLis::class
        ],
        CreateFixEquipmentMaintenance::class  => [
            CreateFixEquipmentMaintenanceLis::class
        ],
        CreateFixEquipmentLocation::class     => [
            CreateFixEquipmentLocationLis::class
        ],
            // VisitorManagement
        CreateVisitor::class                  => [
            CreateVisitorLis::class
        ],
        CreateVisitPurpose::class             => [
            CreateVisitPurposeLis::class
        ],
            // WordpressWoocommerce
        CreateWoocommerceProduct::class       => [
            CreateWoocommerceProductLis::class
        ],
            // Feedback
        CreateHistory::class                  => [
            CreateHistoryLis::class
        ],
        CreateTemplate::class                 => [
            CreateTemplateLis::class
        ],
            // School
        CreateAdmission::class                => [
            CreateAdmissionLis::class
        ],
        CreateClassTimetable::class           => [
            CreateClassTimetableLis::class
        ],
        CreateEmployee::class                 => [
            CreateEmployeeLis::class
        ],
        CreateHomework::class                 => [
            CreateHomeworkLis::class
        ],
        CreateParent::class                   => [
            CreateParentLis::class
        ],
        CreateStudent::class                  => [
            CreateStudentLis::class
        ],
            // CleaningManagement
        CreateCleaningBooking::class          => [
            CreateCleaningBookingLis::class
        ],
        CreateCleaningInvoice::class          => [
            CreateCleaningInvoiceLis::class
        ],
        CreateCleaningTeam::class             => [
            CreateCleaningTeamLis::class
        ],
            // MachineRepairManagement
        CreateMachine::class                  => [
            CreateMachineLis::class
        ],
        CreateMachineRepairRequest::class     => [
            CreateMachineRepairRequestLis::class
        ],
            // HospitalManagement
        CreateHospitalAppointment::class      => [
            CreateHospitalAppointmentLis::class
        ],
        CreateHospitalDoctor::class           => [
            CreateHospitalDoctorLis::class
        ],
        CreateHospitalMedicine::class         => [
            CreateHospitalMedicineLis::class
        ],
        CreateHospitalPatient::class          => [
            CreateHospitalPatientLis::class
        ],
            // Timesheet
        CreateTimesheet::class                => [
            CreateTimesheetLis::class
        ],
            // Notes
        CreateNote::class                     => [
            CreateNoteLis::class
        ],
            // Internalknowledge
        CreateInternalknowledgeArticle::class => [
            CreateInternalknowledgeArticleLis::class
        ],
        CreateInternalknowledgeBook::class    => [
            CreateInternalknowledgeBookLis::class
        ],
            // InnovationCenter
        CreateCategory::class                 => [
            CreateCategoryLis::class
        ],
        CreateChallenge::class                => [
            CreateChallengeLis::class
        ],
        CreateCreativity::class               => [
            CreateCreativityLis::class
        ],
            // ToDo
        CompleteToDo::class                   => [
            CompleteToDoLis::class
        ],
        CreateToDo::class                     => [
            CreateToDoLis::class
        ],
            // Documents
        CreateDocument::class                 => [
            CreateDocumentsLis::class
        ],
        StatusChangeDocument::class           => [
            StatusChangeDocumentLis::class
        ],
            // Account
        CreateCustomer::class                 => [
            CreateCustomerLis::class
        ],
        CreateRevenue::class                  => [
            CreateRevenueLis::class
        ],
        CreateVendor::class                   => [
            CreateVendorLis::class
        ],
            // Hrm
        CreateAnnouncement::class             => [
            CreateAnnouncementLis::class
        ],
        CreateAward::class                    => [
            CreateAwardLis::class
        ],
        CreateEvent::class                    => [
            CreateEventLis::class
        ],
        CreateHoliday::class                  => [
            CreateHolidayLis::class
        ],
        CreatePayroll::class                  => [
            CreatePayrollLis::class
        ],
        UpdateLeaveStatus::class              => [
            UpdateLeaveStatusLis::class
        ],
    ];
}
