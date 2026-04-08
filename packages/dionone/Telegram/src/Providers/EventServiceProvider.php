<?php

namespace DionONE\Telegram\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use App\Events\CreateUser;
use DionONE\Telegram\Listeners\CreateUserLis;

use App\Events\CreatePurchaseInvoice;
use DionONE\Telegram\Listeners\CreatePurchaseInvoiceLis;

use DionONE\Appointment\Events\AppointmentStatus;
use DionONE\Telegram\Listeners\AppointmentStatusLis;

use DionONE\Appointment\Events\CreateSchedule;
use DionONE\Telegram\Listeners\CreateScheduleLis;

use DionONE\CMMS\Events\CreateComponent;
use DionONE\Telegram\Listeners\CreateComponentLis;

use DionONE\CMMS\Events\CreateLocation;
use DionONE\Telegram\Listeners\CreateLocationLis;

use DionONE\CMMS\Events\CreateSupplier;
use DionONE\Telegram\Listeners\CreateSupplierLis;

use DionONE\CMMS\Events\CreatePreventiveMaintenance;
use DionONE\Telegram\Listeners\CreatePreventiveMaintenanceLis;

use DionONE\CMMS\Events\CreateCmmsPos;
use DionONE\Telegram\Listeners\CreateCmmsPosLis;

use DionONE\CMMS\Events\CreateWorkOrder;
use DionONE\Telegram\Listeners\CreateWorkorderLis;

use DionONE\CMMS\Events\CreateWorkRequest;
use DionONE\Telegram\Listeners\CreateWorkRequestLis;

use DionONE\Contract\Events\CreateContract;
use DionONE\Telegram\Listeners\CreateContractLis;

use DionONE\Lead\Events\CreateLead;
use DionONE\Telegram\Listeners\CreateLeadLis;

use DionONE\Lead\Events\LeadConvertDeal;
use DionONE\Telegram\Listeners\LeadConvertDealLis;

use DionONE\Lead\Events\CreateDeal;
use DionONE\Telegram\Listeners\CreateDealLis;

use DionONE\Lead\Events\LeadMoved;
use DionONE\Telegram\Listeners\LeadMovedLis;

use DionONE\Lead\Events\DealMoved;
use DionONE\Telegram\Listeners\DealMovedLis;

use DionONE\Sales\Events\CreateSalesQuote;
use DionONE\Telegram\Listeners\CreateSalesQuoteLis;

use DionONE\Sales\Events\CreateSalesOrder;
use DionONE\Telegram\Listeners\CreateSalesOrderLis;

use App\Events\CreateSalesInvoice;
use DionONE\Telegram\Listeners\CreateSalesInvoiceLis;

use App\Events\CreateSalesProposal;
use DionONE\Telegram\Listeners\CreateSalesProposalLis;

use App\Events\CreateWarehouse;
use DionONE\Telegram\Listeners\CreateWarehouseLis;

use App\Events\PostSalesInvoice;
use DionONE\Telegram\Listeners\PostSalesInvoiceLis;

use App\Events\SentSalesProposal;
use DionONE\Telegram\Listeners\SentSalesProposalLis;

use DionONE\Account\Events\CreateBankTransfer;
use DionONE\Telegram\Listeners\CreateBankTransferLis;

use DionONE\Account\Events\CreateCustomer;
use DionONE\Telegram\Listeners\CreateCustomerLis;

use DionONE\Account\Events\CreateRevenue;
use DionONE\Telegram\Listeners\CreateRevenueLis;

use DionONE\Account\Events\CreateVendor;
use DionONE\Telegram\Listeners\CreateVendorLis;

use DionONE\Sales\Events\CreateSalesMeeting;
use DionONE\Telegram\Listeners\CreateSalesMeetingLis;

use DionONE\Taskly\Events\CreateProject;
use DionONE\Telegram\Listeners\CreateProjectLis;

use DionONE\Taskly\Events\CreateProjectTask;
use DionONE\Telegram\Listeners\CreateProjectTaskLis;

use DionONE\Taskly\Events\CreateProjectBug;
use DionONE\Telegram\Listeners\CreateProjectBugLis;

use DionONE\Taskly\Events\CreateProjectMilestone;
use DionONE\Telegram\Listeners\CreateProjectMilestoneLis;

use DionONE\Taskly\Events\UpdateProjectTaskStage;
use DionONE\Telegram\Listeners\UpdateProjectTaskStageLis;

use DionONE\Taskly\Events\CreateTaskComment;
use DionONE\Telegram\Listeners\CreateTaskCommentLis;

use DionONE\ZoomMeeting\Events\CreateZoomMeeting;
use DionONE\Telegram\Listeners\CreateZoommeetingLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentAccessory;
use DionONE\Telegram\Listeners\CreateFixEquipmentAccessoryLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentAsset;
use DionONE\Telegram\Listeners\CreateFixEquipmentAssetLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentAudit;
use DionONE\Telegram\Listeners\CreateFixEquipmentAuditLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentComponent;
use DionONE\Telegram\Listeners\CreateFixEquipmentComponentLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentConsumable;
use DionONE\Telegram\Listeners\CreateFixEquipmentConsumableLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentLicense;
use DionONE\Telegram\Listeners\CreateFixEquipmentLicenseLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentLocation;
use DionONE\Telegram\Listeners\CreateFixEquipmentLocationLis;

use DionONE\FixEquipment\Events\CreateFixEquipmentMaintenance;
use DionONE\Telegram\Listeners\CreateFixEquipmentMaintenanceLis;

use DionONE\Feedback\Events\CreateHistory;
use DionONE\Telegram\Listeners\CreateHistoryLis;

use DionONE\Feedback\Events\CreateTemplate;
use DionONE\Telegram\Listeners\CreateTemplateLis;

use DionONE\VisitorManagement\Events\CreateVisitor;
use DionONE\Telegram\Listeners\CreateVisitorLis;

use DionONE\VisitorManagement\Events\CreateVisitPurpose;
use DionONE\Telegram\Listeners\CreateVisitPurposeLis;

use DionONE\School\Events\CreateEmployee;
use DionONE\Telegram\Listeners\CreateSchoolEmployeeLis;

use DionONE\School\Events\CreateAdmission;
use DionONE\Telegram\Listeners\CreateAdmissionLis;

use DionONE\School\Events\CreateParent;
use DionONE\Telegram\Listeners\CreateParentLis;

use DionONE\School\Events\CreateStudent;
use DionONE\Telegram\Listeners\CreateSchoolStudentLis;

use DionONE\School\Events\CreateHomework;
use DionONE\Telegram\Listeners\CreateHomeworkLis;

use DionONE\School\Events\CreateSubject;
use DionONE\Telegram\Listeners\CreateSubjectLis;

use DionONE\School\Events\CreateClassTimetable;
use DionONE\Telegram\Listeners\CreateClassTimetableLis;

use DionONE\CleaningManagement\Events\CreateCleaningTeam;
use DionONE\Telegram\Listeners\CreateCleaningTeamLis;

use DionONE\Telegram\Listeners\CreateCleaningBookingLis;
use DionONE\CleaningManagement\Events\CreateCleaningBooking;

use DionONE\CleaningManagement\Events\CreateCleaningInvoice;
use DionONE\Telegram\Listeners\CreateCleaningInvoiceLis;

use DionONE\MachineRepairManagement\Events\CreateMachine;
use DionONE\MachineRepairManagement\Events\CreateMachineRepairRequest;

use DionONE\Telegram\Listeners\CreateMachineLis;
use DionONE\Telegram\Listeners\CreateMachineRepairRequestLis;

use DionONE\HospitalManagement\Events\CreateHospitalDoctor;
use DionONE\Telegram\Listeners\CreateHospitalDoctorLis;

use DionONE\HospitalManagement\Events\CreateHospitalMedicine;
use DionONE\Telegram\Listeners\CreateHospitalMedicineLis;

use DionONE\HospitalManagement\Events\CreateHospitalPatient;
use DionONE\Telegram\Listeners\CreateHospitalPatientLis;

use DionONE\HospitalManagement\Events\CreateHospitalAppointment;
use DionONE\Telegram\Listeners\CreateHospitalAppointmentLis;

use DionONE\Timesheet\Events\CreateTimesheet;
use DionONE\Telegram\Listeners\CreateTimesheetLis;

use DionONE\Notes\Events\CreateNote;
use DionONE\Telegram\Listeners\CreateNoteLis;

use DionONE\Internalknowledge\Events\CreateInternalknowledgeBook;
use DionONE\Telegram\Listeners\CreateInternalknowledgeBookLis;

use DionONE\Internalknowledge\Events\CreateInternalknowledgeArticle;
use DionONE\Telegram\Listeners\CreateInternalknowledgeArticleLis;

use DionONE\InnovationCenter\Events\CreateCreativity;
use DionONE\Telegram\Listeners\CreateCreativityLis;

use DionONE\InnovationCenter\Events\CreateChallenge;
use DionONE\Telegram\Listeners\CreateChallengeLis;

use DionONE\InnovationCenter\Events\CreateCategory;
use DionONE\Telegram\Listeners\CreateCategoryLis;

use DionONE\ToDo\Events\CreateToDo;
use DionONE\Telegram\Listeners\CreateToDoLis;

use DionONE\ToDo\Events\CompleteToDo;
use DionONE\Telegram\Listeners\CompleteToDoLis;

use DionONE\Documents\Events\CreateDocument;
use DionONE\Telegram\Listeners\CreateDocumentLis;

use DionONE\Documents\Events\StatusChangeDocument;
use DionONE\Telegram\Listeners\StatusChangeDocumentLis;

use DionONE\Hrm\Events\CreateAnnouncement;
use DionONE\Telegram\Listeners\CreateAnnouncementLis;

use DionONE\Hrm\Events\CreateAward;
use DionONE\Telegram\Listeners\CreateAwardLis;

use DionONE\Hrm\Events\CreateEvent;
use DionONE\Telegram\Listeners\CreateEventLis;

use DionONE\Hrm\Events\CreateHoliday;
use DionONE\Telegram\Listeners\CreateHolidayLis;

use DionONE\Hrm\Events\CreatePayroll;
use DionONE\Telegram\Listeners\CreatePayrollLis;

use DionONE\Hrm\Events\UpdateLeaveStatus;
use DionONE\Telegram\Listeners\UpdateLeaveStatusLis;

use DionONE\Taskly\Events\UpdateTaskStage;
use DionONE\Telegram\Listeners\UpdateTaskStageLis;

use DionONE\WordpressWoocommerce\Events\CreateWoocommerceProduct;
use DionONE\Telegram\Listeners\CreateWoocommerceProductLis;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        CreateUser::class => [
            CreateUserLis::class,
        ],

        PostSalesInvoice::class => [
            PostSalesInvoiceLis::class,
        ],

        SentSalesProposal::class => [
            SentSalesProposalLis::class,
        ],

        CreatePurchaseInvoice::class => [
            CreatePurchaseInvoiceLis::class,
        ],

        CreateWarehouse::class => [
            CreateWarehouseLis::class,
        ],

        CreateSalesProposal::class => [
            CreateSalesProposalLis::class,
        ],

        CreateCustomer::class => [
            CreateCustomerLis::class,
        ],

        CreateVendor::class => [
            CreateVendorLis::class,
        ],

        CreateRevenue::class => [
            CreateRevenueLis::class,
        ],

        CreateBankTransfer::class => [
            CreateBankTransferLis::class,
        ],

        AppointmentStatus::class => [
            AppointmentStatusLis::class,
        ],

        CreateSchedule::class => [
            CreateScheduleLis::class,
        ],

        CreateLocation::class => [
            CreateLocationLis::class,
        ],

        CreateSupplier::class => [
            CreateSupplierLis::class,
        ],

        CreateComponent::class => [
            CreateComponentLis::class,
        ],

        CreatePreventiveMaintenance::class => [
            CreatePreventiveMaintenanceLis::class,
        ],

        CreateCmmsPos::class => [
            CreateCmmsPosLis::class,
        ],

        CreateWorkOrder::class => [
            CreateWorkorderLis::class,
        ],

        CreateWorkRequest::class => [
            CreateWorkRequestLis::class,
        ],

        CreateContract::class => [
            CreateContractLis::class,
        ],

        CreatePayroll::class => [
            CreatePayrollLis::class,
        ],

        CreateAward::class => [
            CreateAwardLis::class,
        ],

        CreateEvent::class => [
            CreateEventLis::class,
        ],

        UpdateLeaveStatus::class => [
            UpdateLeaveStatusLis::class,
        ],

        CreateAnnouncement::class => [
            CreateAnnouncementLis::class,
        ],

        CreateHoliday::class => [
            CreateHolidayLis::class,
        ],

        CreateLead::class => [
            CreateLeadLis::class,
        ],

        LeadConvertDeal::class => [
            LeadConvertDealLis::class,
        ],

        CreateDeal::class => [
            CreateDealLis::class,
        ],

        LeadMoved::class => [
            LeadMovedLis::class,
        ],

        DealMoved::class => [
            DealMovedLis::class,
        ],

        CreateSalesQuote::class => [
            CreateSalesQuoteLis::class,
        ],

        CreateSalesOrder::class => [
            CreateSalesOrderLis::class,
        ],

        CreateSalesInvoice::class => [
            CreateSalesInvoiceLis::class,
        ],

        CreateSalesMeeting::class => [
            CreateSalesMeetingLis::class,
        ],

        CreateProject::class => [
            CreateProjectLis::class,
        ],

        CreateProjectTask::class => [
            CreateProjectTaskLis::class,
        ],

        CreateProjectBug::class => [
            CreateProjectBugLis::class,
        ],

        CreateProjectMilestone::class => [
            CreateProjectMilestoneLis::class,
        ],

        UpdateProjectTaskStage::class => [
            UpdateProjectTaskStageLis::class,
        ],

        UpdateTaskStage::class => [
            UpdateTaskStageLis::class,
        ],

        CreateTaskComment::class => [
            CreateTaskCommentLis::class,
        ],

        CreateZoomMeeting::class => [
            CreateZoommeetingLis::class
        ],

        CreateFixEquipmentAccessory::class => [
            CreateFixEquipmentAccessoryLis::class,
        ],

        CreateFixEquipmentAsset::class => [
            CreateFixEquipmentAssetLis::class,
        ],

        CreateFixEquipmentAudit::class => [
            CreateFixEquipmentAuditLis::class,
        ],

        CreateFixEquipmentComponent::class => [
            CreateFixEquipmentComponentLis::class,
        ],

        CreateFixEquipmentConsumable::class => [
            CreateFixEquipmentConsumableLis::class,
        ],

        CreateFixEquipmentLicense::class => [
            CreateFixEquipmentLicenseLis::class,
        ],

        CreateFixEquipmentLocation::class => [
            CreateFixEquipmentLocationLis::class,
        ],

        CreateFixEquipmentMaintenance::class => [
            CreateFixEquipmentMaintenanceLis::class,
        ],

        CreateVisitor::class => [
            CreateVisitorLis::class,
        ],

        CreateVisitPurpose::class => [
            CreateVisitPurposeLis::class,
        ],

        CreateTemplate::class => [
            CreateTemplateLis::class,
        ],

        CreateHistory::class => [
            CreateHistoryLis::class,
        ],

        CreateEmployee::class => [
            CreateSchoolEmployeeLis::class,
        ],

        CreateAdmission::class => [
            CreateAdmissionLis::class,
        ],

        CreateParent::class => [
            CreateParentLis::class,
        ],

        CreateStudent::class => [
            CreateSchoolStudentLis::class,
        ],

        CreateHomework::class => [
            CreateHomeworkLis::class,
        ],

        CreateSubject::class => [
            CreateSubjectLis::class,
        ],

        CreateClassTimetable::class => [
            CreateClassTimetableLis::class,
        ],

        CreateCleaningTeam::class => [
            CreateCleaningTeamLis::class,
        ],

        CreateCleaningBooking::class => [
            CreateCleaningBookingLis::class,
        ],

        CreateCleaningInvoice::class => [
            CreateCleaningInvoiceLis::class,
        ],

        CreateMachine::class => [
            CreateMachineLis::class,
        ],

        CreateMachineRepairRequest::class => [
            CreateMachineRepairRequestLis::class,
        ],

        CreateHospitalDoctor::class => [
            CreateHospitalDoctorLis::class,
        ],

        CreateHospitalPatient::class => [
            CreateHospitalPatientLis::class,
        ],

        CreateHospitalAppointment::class => [
            CreateHospitalAppointmentLis::class,
        ],

        CreateHospitalMedicine::class => [
            CreateHospitalMedicineLis::class,
        ],

        CreateTimesheet::class => [
            CreateTimesheetLis::class,
        ],

        CreateNote::class => [
            CreateNoteLis::class,
        ],

        CreateInternalknowledgeArticle::class => [
            CreateInternalknowledgeArticleLis::class,
        ],

        CreateInternalknowledgeBook::class => [
            CreateInternalknowledgeBookLis::class,
        ],

        CreateCreativity::class => [
            CreateCreativityLis::class,
        ],

        CreateChallenge::class => [
            CreateChallengeLis::class,
        ],

        CreateCategory::class => [
            CreateCategoryLis::class,
        ],

        CreateToDo::class => [
            CreateToDoLis::class,
        ],

        CompleteToDo::class => [
            CompleteToDoLis::class,
        ],

        CreateDocument::class => [
            CreateDocumentLis::class,
        ],

        StatusChangeDocument::class => [
            StatusChangeDocumentLis::class,
        ],

        CreateWoocommerceProduct::class => [
            CreateWoocommerceProductLis::class,
        ],
    ];
}
