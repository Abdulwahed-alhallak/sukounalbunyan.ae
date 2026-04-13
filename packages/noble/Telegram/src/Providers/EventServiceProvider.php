<?php

namespace Noble\Telegram\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

use App\Events\CreateUser;
use Noble\Telegram\Listeners\CreateUserLis;

use App\Events\CreatePurchaseInvoice;
use Noble\Telegram\Listeners\CreatePurchaseInvoiceLis;

use Noble\Appointment\Events\AppointmentStatus;
use Noble\Telegram\Listeners\AppointmentStatusLis;

use Noble\Appointment\Events\CreateSchedule;
use Noble\Telegram\Listeners\CreateScheduleLis;

use Noble\CMMS\Events\CreateComponent;
use Noble\Telegram\Listeners\CreateComponentLis;

use Noble\CMMS\Events\CreateLocation;
use Noble\Telegram\Listeners\CreateLocationLis;

use Noble\CMMS\Events\CreateSupplier;
use Noble\Telegram\Listeners\CreateSupplierLis;

use Noble\CMMS\Events\CreatePreventiveMaintenance;
use Noble\Telegram\Listeners\CreatePreventiveMaintenanceLis;

use Noble\CMMS\Events\CreateCmmsPos;
use Noble\Telegram\Listeners\CreateCmmsPosLis;

use Noble\CMMS\Events\CreateWorkOrder;
use Noble\Telegram\Listeners\CreateWorkorderLis;

use Noble\CMMS\Events\CreateWorkRequest;
use Noble\Telegram\Listeners\CreateWorkRequestLis;

use Noble\Contract\Events\CreateContract;
use Noble\Telegram\Listeners\CreateContractLis;

use Noble\Lead\Events\CreateLead;
use Noble\Telegram\Listeners\CreateLeadLis;

use Noble\Lead\Events\LeadConvertDeal;
use Noble\Telegram\Listeners\LeadConvertDealLis;

use Noble\Lead\Events\CreateDeal;
use Noble\Telegram\Listeners\CreateDealLis;

use Noble\Lead\Events\LeadMoved;
use Noble\Telegram\Listeners\LeadMovedLis;

use Noble\Lead\Events\DealMoved;
use Noble\Telegram\Listeners\DealMovedLis;

use Noble\Sales\Events\CreateSalesQuote;
use Noble\Telegram\Listeners\CreateSalesQuoteLis;

use Noble\Sales\Events\CreateSalesOrder;
use Noble\Telegram\Listeners\CreateSalesOrderLis;

use App\Events\CreateSalesInvoice;
use Noble\Telegram\Listeners\CreateSalesInvoiceLis;

use App\Events\CreateSalesProposal;
use Noble\Telegram\Listeners\CreateSalesProposalLis;

use App\Events\CreateWarehouse;
use Noble\Telegram\Listeners\CreateWarehouseLis;

use App\Events\PostSalesInvoice;
use Noble\Telegram\Listeners\PostSalesInvoiceLis;

use App\Events\SentSalesProposal;
use Noble\Telegram\Listeners\SentSalesProposalLis;

use Noble\Account\Events\CreateBankTransfer;
use Noble\Telegram\Listeners\CreateBankTransferLis;

use Noble\Account\Events\CreateCustomer;
use Noble\Telegram\Listeners\CreateCustomerLis;

use Noble\Account\Events\CreateRevenue;
use Noble\Telegram\Listeners\CreateRevenueLis;

use Noble\Account\Events\CreateVendor;
use Noble\Telegram\Listeners\CreateVendorLis;

use Noble\Sales\Events\CreateSalesMeeting;
use Noble\Telegram\Listeners\CreateSalesMeetingLis;

use Noble\Taskly\Events\CreateProject;
use Noble\Telegram\Listeners\CreateProjectLis;

use Noble\Taskly\Events\CreateProjectTask;
use Noble\Telegram\Listeners\CreateProjectTaskLis;

use Noble\Taskly\Events\CreateProjectBug;
use Noble\Telegram\Listeners\CreateProjectBugLis;

use Noble\Taskly\Events\CreateProjectMilestone;
use Noble\Telegram\Listeners\CreateProjectMilestoneLis;

use Noble\Taskly\Events\UpdateProjectTaskStage;
use Noble\Telegram\Listeners\UpdateProjectTaskStageLis;

use Noble\Taskly\Events\CreateTaskComment;
use Noble\Telegram\Listeners\CreateTaskCommentLis;

use Noble\ZoomMeeting\Events\CreateZoomMeeting;
use Noble\Telegram\Listeners\CreateZoommeetingLis;

use Noble\FixEquipment\Events\CreateFixEquipmentAccessory;
use Noble\Telegram\Listeners\CreateFixEquipmentAccessoryLis;

use Noble\FixEquipment\Events\CreateFixEquipmentAsset;
use Noble\Telegram\Listeners\CreateFixEquipmentAssetLis;

use Noble\FixEquipment\Events\CreateFixEquipmentAudit;
use Noble\Telegram\Listeners\CreateFixEquipmentAuditLis;

use Noble\FixEquipment\Events\CreateFixEquipmentComponent;
use Noble\Telegram\Listeners\CreateFixEquipmentComponentLis;

use Noble\FixEquipment\Events\CreateFixEquipmentConsumable;
use Noble\Telegram\Listeners\CreateFixEquipmentConsumableLis;

use Noble\FixEquipment\Events\CreateFixEquipmentLicense;
use Noble\Telegram\Listeners\CreateFixEquipmentLicenseLis;

use Noble\FixEquipment\Events\CreateFixEquipmentLocation;
use Noble\Telegram\Listeners\CreateFixEquipmentLocationLis;

use Noble\FixEquipment\Events\CreateFixEquipmentMaintenance;
use Noble\Telegram\Listeners\CreateFixEquipmentMaintenanceLis;

use Noble\Feedback\Events\CreateHistory;
use Noble\Telegram\Listeners\CreateHistoryLis;

use Noble\Feedback\Events\CreateTemplate;
use Noble\Telegram\Listeners\CreateTemplateLis;

use Noble\VisitorManagement\Events\CreateVisitor;
use Noble\Telegram\Listeners\CreateVisitorLis;

use Noble\VisitorManagement\Events\CreateVisitPurpose;
use Noble\Telegram\Listeners\CreateVisitPurposeLis;

use Noble\School\Events\CreateEmployee;
use Noble\Telegram\Listeners\CreateSchoolEmployeeLis;

use Noble\School\Events\CreateAdmission;
use Noble\Telegram\Listeners\CreateAdmissionLis;

use Noble\School\Events\CreateParent;
use Noble\Telegram\Listeners\CreateParentLis;

use Noble\School\Events\CreateStudent;
use Noble\Telegram\Listeners\CreateSchoolStudentLis;

use Noble\School\Events\CreateHomework;
use Noble\Telegram\Listeners\CreateHomeworkLis;

use Noble\School\Events\CreateSubject;
use Noble\Telegram\Listeners\CreateSubjectLis;

use Noble\School\Events\CreateClassTimetable;
use Noble\Telegram\Listeners\CreateClassTimetableLis;

use Noble\CleaningManagement\Events\CreateCleaningTeam;
use Noble\Telegram\Listeners\CreateCleaningTeamLis;

use Noble\Telegram\Listeners\CreateCleaningBookingLis;
use Noble\CleaningManagement\Events\CreateCleaningBooking;

use Noble\CleaningManagement\Events\CreateCleaningInvoice;
use Noble\Telegram\Listeners\CreateCleaningInvoiceLis;

use Noble\MachineRepairManagement\Events\CreateMachine;
use Noble\MachineRepairManagement\Events\CreateMachineRepairRequest;

use Noble\Telegram\Listeners\CreateMachineLis;
use Noble\Telegram\Listeners\CreateMachineRepairRequestLis;

use Noble\HospitalManagement\Events\CreateHospitalDoctor;
use Noble\Telegram\Listeners\CreateHospitalDoctorLis;

use Noble\HospitalManagement\Events\CreateHospitalMedicine;
use Noble\Telegram\Listeners\CreateHospitalMedicineLis;

use Noble\HospitalManagement\Events\CreateHospitalPatient;
use Noble\Telegram\Listeners\CreateHospitalPatientLis;

use Noble\HospitalManagement\Events\CreateHospitalAppointment;
use Noble\Telegram\Listeners\CreateHospitalAppointmentLis;

use Noble\Timesheet\Events\CreateTimesheet;
use Noble\Telegram\Listeners\CreateTimesheetLis;

use Noble\Notes\Events\CreateNote;
use Noble\Telegram\Listeners\CreateNoteLis;

use Noble\Internalknowledge\Events\CreateInternalknowledgeBook;
use Noble\Telegram\Listeners\CreateInternalknowledgeBookLis;

use Noble\Internalknowledge\Events\CreateInternalknowledgeArticle;
use Noble\Telegram\Listeners\CreateInternalknowledgeArticleLis;

use Noble\InnovationCenter\Events\CreateCreativity;
use Noble\Telegram\Listeners\CreateCreativityLis;

use Noble\InnovationCenter\Events\CreateChallenge;
use Noble\Telegram\Listeners\CreateChallengeLis;

use Noble\InnovationCenter\Events\CreateCategory;
use Noble\Telegram\Listeners\CreateCategoryLis;

use Noble\ToDo\Events\CreateToDo;
use Noble\Telegram\Listeners\CreateToDoLis;

use Noble\ToDo\Events\CompleteToDo;
use Noble\Telegram\Listeners\CompleteToDoLis;

use Noble\Documents\Events\CreateDocument;
use Noble\Telegram\Listeners\CreateDocumentLis;

use Noble\Documents\Events\StatusChangeDocument;
use Noble\Telegram\Listeners\StatusChangeDocumentLis;

use Noble\Hrm\Events\CreateAnnouncement;
use Noble\Telegram\Listeners\CreateAnnouncementLis;

use Noble\Hrm\Events\CreateAward;
use Noble\Telegram\Listeners\CreateAwardLis;

use Noble\Hrm\Events\CreateEvent;
use Noble\Telegram\Listeners\CreateEventLis;

use Noble\Hrm\Events\CreateHoliday;
use Noble\Telegram\Listeners\CreateHolidayLis;

use Noble\Hrm\Events\CreatePayroll;
use Noble\Telegram\Listeners\CreatePayrollLis;

use Noble\Hrm\Events\UpdateLeaveStatus;
use Noble\Telegram\Listeners\UpdateLeaveStatusLis;

use Noble\Taskly\Events\UpdateTaskStage;
use Noble\Telegram\Listeners\UpdateTaskStageLis;

use Noble\WordpressWoocommerce\Events\CreateWoocommerceProduct;
use Noble\Telegram\Listeners\CreateWoocommerceProductLis;

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
