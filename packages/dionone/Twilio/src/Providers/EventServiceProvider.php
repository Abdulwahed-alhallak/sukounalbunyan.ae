<?php

namespace DionONE\Twilio\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use App\Events\CreateSalesProposal;
use App\Events\PostSalesInvoice;
use App\Events\SentSalesProposal;
use App\Events\CreatePurchaseInvoice;
use App\Events\CreateUser;
use App\Events\CreateWarehouse;
use App\Events\CreateSalesInvoice;


use DionONE\Account\Events\CreateBankTransfer;
use DionONE\Account\Events\CreateCustomer;
use DionONE\Account\Events\CreateRevenue;
use DionONE\Account\Events\CreateVendor;

use DionONE\Appointment\Events\AppointmentStatus;
use DionONE\Appointment\Events\CreateSchedule;

use DionONE\CleaningManagement\Events\CreateCleaningBooking;
use DionONE\CleaningManagement\Events\CreateCleaningInvoice;
use DionONE\CleaningManagement\Events\CreateCleaningTeam;

use DionONE\CMMS\Events\CreateCmmsPos;
use DionONE\CMMS\Events\CreateComponent;
use DionONE\CMMS\Events\CreateLocation;
use DionONE\CMMS\Events\CreatePreventiveMaintenance;
use DionONE\CMMS\Events\CreateSupplier;
use DionONE\CMMS\Events\CreateWorkOrder;
use DionONE\CMMS\Events\CreateWorkRequest;

use DionONE\Contract\Events\CreateContract;

use DionONE\Documents\Events\CreateDocument;
use DionONE\Documents\Events\StatusChangeDocument;

use DionONE\Feedback\Events\CreateHistory;
use DionONE\Feedback\Events\CreateTemplate;

use DionONE\FixEquipment\Events\CreateFixEquipmentAccessory;
use DionONE\FixEquipment\Events\CreateFixEquipmentAsset;
use DionONE\FixEquipment\Events\CreateFixEquipmentAudit;
use DionONE\FixEquipment\Events\CreateFixEquipmentComponent;
use DionONE\FixEquipment\Events\CreateFixEquipmentConsumable;
use DionONE\FixEquipment\Events\CreateFixEquipmentLicense;
use DionONE\FixEquipment\Events\CreateFixEquipmentLocation;
use DionONE\FixEquipment\Events\CreateFixEquipmentMaintenance;

use DionONE\HospitalManagement\Events\CreateHospitalAppointment;
use DionONE\HospitalManagement\Events\CreateHospitalDoctor;
use DionONE\HospitalManagement\Events\CreateHospitalMedicine;
use DionONE\HospitalManagement\Events\CreateHospitalPatient;

use DionONE\Hrm\Events\CreateAnnouncement;
use DionONE\Hrm\Events\CreateAward;
use DionONE\Hrm\Events\CreateEvent;
use DionONE\Hrm\Events\CreateHoliday;
use DionONE\Hrm\Events\CreatePayroll;
use DionONE\Hrm\Events\UpdateLeaveStatus;

use DionONE\InnovationCenter\Events\CreateCategory;
use DionONE\InnovationCenter\Events\CreateChallenge;
use DionONE\InnovationCenter\Events\CreateCreativity;
use DionONE\Internalknowledge\Events\CreateInternalknowledgeArticle;
use DionONE\Internalknowledge\Events\CreateInternalknowledgeBook;

use DionONE\Lead\Events\CreateDeal;
use DionONE\Lead\Events\CreateLead;
use DionONE\Lead\Events\DealMoved;
use DionONE\Lead\Events\LeadConvertDeal;
use DionONE\Lead\Events\LeadMoved;

use DionONE\MachineRepairManagement\Events\CreateMachine;
use DionONE\MachineRepairManagement\Events\CreateMachineRepairRequest;

use DionONE\Notes\Events\CreateNote;

use DionONE\Sales\Events\CreateSalesMeeting;
use DionONE\Sales\Events\CreateSalesOrder;
use DionONE\Sales\Events\CreateSalesQuote;

use DionONE\School\Events\CreateAdmission;
use DionONE\School\Events\CreateClassTimetable;
use DionONE\School\Events\CreateEmployee;
use DionONE\School\Events\CreateHomework;
use DionONE\School\Events\CreateParent;
use DionONE\School\Events\CreateStudent;

use DionONE\Taskly\Events\CreateProjectBug;
use DionONE\Taskly\Events\CreateProject;
use DionONE\Taskly\Events\CreateProjectMilestone;
use DionONE\Taskly\Events\CreateProjectTask;
use DionONE\Taskly\Events\CreateTaskComment;
use DionONE\Taskly\Events\UpdateProjectTaskStage;

use DionONE\Timesheet\Events\CreateTimesheet;

use DionONE\ToDo\Events\CompleteToDo;
use DionONE\ToDo\Events\CreateToDo;

use DionONE\Twilio\Listeners\AppointmentStatusLis;
use DionONE\Twilio\Listeners\CompleteToDoLis;
use DionONE\Twilio\Listeners\CreateAdmissionLis;
use DionONE\Twilio\Listeners\CreateAnnouncementLis;
use DionONE\Twilio\Listeners\CreateAwardLis;
use DionONE\Twilio\Listeners\CreateBankTransferLis;
use DionONE\Twilio\Listeners\CreateCategoryLis;
use DionONE\Twilio\Listeners\CreateChallengeLis;
use DionONE\Twilio\Listeners\CreateClassTimetableLis;
use DionONE\Twilio\Listeners\CreateCleaningBookingLis;
use DionONE\Twilio\Listeners\CreateCleaningInvoiceLis;
use DionONE\Twilio\Listeners\CreateCleaningTeamLis;
use DionONE\Twilio\Listeners\CreateCmmsPosLis;
use DionONE\Twilio\Listeners\CreateComponentLis;
use DionONE\Twilio\Listeners\CreateContractLis;
use DionONE\Twilio\Listeners\CreateCreativityLis;
use DionONE\Twilio\Listeners\CreateCustomerLis;
use DionONE\Twilio\Listeners\CreateDealLis;
use DionONE\Twilio\Listeners\CreateDocumentsLis;
use DionONE\Twilio\Listeners\CreateEmployeeLis;
use DionONE\Twilio\Listeners\CreateEventLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentAccessoryLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentAssetLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentAuditLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentComponentLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentConsumableLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentLicenseLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentLocationLis;
use DionONE\Twilio\Listeners\CreateFixEquipmentMaintenanceLis;
use DionONE\Twilio\Listeners\CreateHistoryLis;
use DionONE\Twilio\Listeners\CreateHolidayLis;
use DionONE\Twilio\Listeners\CreateHomeworkLis;
use DionONE\Twilio\Listeners\CreateHospitalAppointmentLis;
use DionONE\Twilio\Listeners\CreateHospitalDoctorLis;
use DionONE\Twilio\Listeners\CreateHospitalMedicineLis;
use DionONE\Twilio\Listeners\CreateHospitalPatientLis;
use DionONE\Twilio\Listeners\CreateInternalknowledgeArticleLis;
use DionONE\Twilio\Listeners\CreateInternalknowledgeBookLis;
use DionONE\Twilio\Listeners\CreateLeadLis;
use DionONE\Twilio\Listeners\CreateLocationLis;
use DionONE\Twilio\Listeners\CreateMachineLis;
use DionONE\Twilio\Listeners\CreateMachineRepairRequestLis;
use DionONE\Twilio\Listeners\CreateNoteLis;
use DionONE\Twilio\Listeners\CreateParentLis;
use DionONE\Twilio\Listeners\CreatePayrollLis;
use DionONE\Twilio\Listeners\CreatePreventiveMaintenanceLis;
use DionONE\Twilio\Listeners\CreateProjectBugLis;
use DionONE\Twilio\Listeners\CreateProjectLis;
use DionONE\Twilio\Listeners\CreateProjectMilestoneLis;
use DionONE\Twilio\Listeners\CreateProjectTaskLis;
use DionONE\Twilio\Listeners\CreatePurchaseInvoiceLis;
use DionONE\Twilio\Listeners\CreateRevenueLis;
use DionONE\Twilio\Listeners\CreateSalesInvoiceLis;
use DionONE\Twilio\Listeners\CreateSalesMeetingLis;
use DionONE\Twilio\Listeners\CreateSalesOrderLis;
use DionONE\Twilio\Listeners\CreateSalesProposalLis;
use DionONE\Twilio\Listeners\CreateSalesQuoteLis;
use DionONE\Twilio\Listeners\CreateScheduleLis;
use DionONE\Twilio\Listeners\CreateStudentLis;
use DionONE\Twilio\Listeners\CreateSupplierLis;
use DionONE\Twilio\Listeners\CreateTaskCommentLis;
use DionONE\Twilio\Listeners\CreateTemplateLis;
use DionONE\Twilio\Listeners\CreateTimesheetLis;
use DionONE\Twilio\Listeners\CreateToDoLis;
use DionONE\Twilio\Listeners\CreateUserLis;
use DionONE\Twilio\Listeners\CreateVendorLis;
use DionONE\Twilio\Listeners\CreateVisitorLis;
use DionONE\Twilio\Listeners\CreateVisitPurposeLis;
use DionONE\Twilio\Listeners\CreateWarehouseLis;
use DionONE\Twilio\Listeners\CreateWoocommerceProductLis;
use DionONE\Twilio\Listeners\CreateWorkOrderLis;
use DionONE\Twilio\Listeners\CreateWorkRequestLis;
use DionONE\Twilio\Listeners\CreateZoomMeetingLis;
use DionONE\Twilio\Listeners\DealMovedLis;
use DionONE\Twilio\Listeners\LeadConvertDealLis;
use DionONE\Twilio\Listeners\LeadMovedLis;
use DionONE\Twilio\Listeners\PostSalesInvoiceLis;
use DionONE\Twilio\Listeners\SentSalesProposalLis;
use DionONE\Twilio\Listeners\StatusChangeDocumentLis;
use DionONE\Twilio\Listeners\UpdateLeaveStatusLis;
use DionONE\Twilio\Listeners\UpdateProjectTaskStageLis;

use DionONE\VisitorManagement\Events\CreateVisitor;
use DionONE\VisitorManagement\Events\CreateVisitPurpose;

use DionONE\WordpressWoocommerce\Events\CreateWoocommerceProduct;

use DionONE\ZoomMeeting\Events\CreateZoomMeeting;

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
