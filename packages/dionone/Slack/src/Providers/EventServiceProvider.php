<?php

namespace DionONE\Slack\Providers;

use App\Events\CreatePurchaseInvoice;
use App\Events\CreateSalesInvoice;
use App\Events\CreateSalesProposal;
use App\Events\CreateUser;
use App\Events\CreateWarehouse;
use App\Events\PostSalesInvoice;
use App\Events\SentSalesProposal;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use DionONE\Account\Events\CreateCustomer;
use DionONE\Account\Events\CreateRevenue;
use DionONE\Account\Events\CreateVendor;
use DionONE\Appointment\Events\AppointmentStatus;
use DionONE\Appointment\Events\CreateAppointment;
use DionONE\CleaningManagement\Events\CreateCleaningBooking;
use DionONE\CleaningManagement\Events\CreateCleaningInvoice;
use DionONE\CleaningManagement\Events\CreateCleaningTeam;
use DionONE\CMMS\Events\CreateCmmsPos;
use DionONE\CMMS\Events\CreateComponent;
use DionONE\CMMS\Events\CreateLocation;
use DionONE\CMMS\Events\CreatePreventiveMaintenance;
use DionONE\CMMS\Events\CreateSupplier;
use DionONE\CMMS\Events\CreateWorkOrder;
use DionONE\CMMS\Events\CreateWorkrequest;
use DionONE\Contract\Events\CreateContract;
use DionONE\Documents\Events\CreateDocument;
use DionONE\FixEquipment\Events\CreateFixEquipmentAccessory;
use DionONE\FixEquipment\Events\CreateFixEquipmentAsset;
use DionONE\FixEquipment\Events\CreateFixEquipmentAudit;
use DionONE\FixEquipment\Events\CreateFixEquipmentComponent;
use DionONE\FixEquipment\Events\CreateFixEquipmentConsumable;
use DionONE\FixEquipment\Events\CreateFixEquipmentLicense;
use DionONE\FixEquipment\Events\CreateFixEquipmentLocation;
use DionONE\FixEquipment\Events\CreateFixEquipmentMaintenance;
use DionONE\FormBuilder\Events\CreateForm;
use DionONE\FormBuilder\Events\FormConverted;
use DionONE\HospitalManagement\Events\CreateHospitalAppointment;
use DionONE\HospitalManagement\Events\CreateHospitalDoctor;
use DionONE\HospitalManagement\Events\CreateHospitalMedicine;
use DionONE\HospitalManagement\Events\CreateHospitalPatient;
use DionONE\Hrm\Events\CreateAward;
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
use DionONE\Portfolio\Events\CreatePortfolio;
use DionONE\Recruitment\Events\ConvertOfferToEmployee;
use DionONE\Recruitment\Events\CreateCandidate;
use DionONE\Recruitment\Events\CreateInterview;
use DionONE\Recruitment\Events\CreateJobPosting;
use DionONE\Retainer\Events\CreateRetainer;
use DionONE\Retainer\Events\CreateRetainerPayment;
use DionONE\Sales\Events\CreateSalesMeeting;
use DionONE\Sales\Events\CreateSalesOrder;
use DionONE\Sales\Events\CreateSalesQuote;
use DionONE\School\Events\CreateAdmission;
use DionONE\School\Events\CreateClassTimetable;
use DionONE\School\Events\CreateHomework;
use DionONE\School\Events\CreateParent;
use DionONE\School\Events\CreateStudent;
use DionONE\School\Events\CreateSubject;
use DionONE\Slack\Listeners\AppointmentStatusLis;
use DionONE\Slack\Listeners\CompleteToDoLis;
use DionONE\Slack\Listeners\ConvertOfferToEmployeeLis;
use DionONE\Slack\Listeners\CreateAdmissionLis;
use DionONE\Slack\Listeners\CreateAppointmentLis;
use DionONE\Slack\Listeners\CreateAwardLis;
use DionONE\Slack\Listeners\CreateCandidateLis;
use DionONE\Slack\Listeners\CreateCategoryLis;
use DionONE\Slack\Listeners\CreateChallengeLis;
use DionONE\Slack\Listeners\CreateClassTimetableLis;
use DionONE\Slack\Listeners\CreateCleaningBookingLis;
use DionONE\Slack\Listeners\CreateCleaningInvoiceLis;
use DionONE\Slack\Listeners\CreateCleaningTeamLis;
use DionONE\Slack\Listeners\CreateCmmsPosLis;
use DionONE\Slack\Listeners\CreateComponentLis;
use DionONE\Slack\Listeners\CreateContractLis;
use DionONE\Slack\Listeners\CreateCourseLis;
use DionONE\Slack\Listeners\CreateCreativityLis;
use DionONE\Slack\Listeners\CreateCustomerLis;
use DionONE\Slack\Listeners\CreateCustomPageLis;
use DionONE\Slack\Listeners\CreateDealLis;
use DionONE\Slack\Listeners\CreateDocumentLis;
use DionONE\Slack\Listeners\CreateFixEquipmentAccessoryLis;
use DionONE\Slack\Listeners\CreateFixEquipmentAssetLis;
use DionONE\Slack\Listeners\CreateFixEquipmentAuditLis;
use DionONE\Slack\Listeners\CreateFixEquipmentComponentLis;
use DionONE\Slack\Listeners\CreateFixEquipmentConsumableLis;
use DionONE\Slack\Listeners\CreateFixEquipmentLicenseLis;
use DionONE\Slack\Listeners\CreateFixEquipmentLocationLis;
use DionONE\Slack\Listeners\CreateFixEquipmentMaintenanceLis;
use DionONE\Slack\Listeners\CreateFormLis;
use DionONE\Slack\Listeners\CreateHistoryLis;
use DionONE\Slack\Listeners\CreateHomeworkLis;
use DionONE\Slack\Listeners\CreateHospitalAppointmentLis;
use DionONE\Slack\Listeners\CreateHospitalDoctorLis;
use DionONE\Slack\Listeners\CreateHospitalMedicineLis;
use DionONE\Slack\Listeners\CreateHospitalPatientLis;
use DionONE\Slack\Listeners\CreateInternalknowledgeArticleLis;
use DionONE\Slack\Listeners\CreateInternalknowledgeBookLis;
use DionONE\Slack\Listeners\CreateInterviewLis;
use DionONE\Slack\Listeners\CreateJobPostingLis;
use DionONE\Slack\Listeners\CreateLeadLis;
use DionONE\Slack\Listeners\CreateLocationLis;
use DionONE\Slack\Listeners\CreateMachineLis;
use DionONE\Slack\Listeners\CreateMachineRepairRequestLis;
use DionONE\Slack\Listeners\CreateNoteLis;
use DionONE\Slack\Listeners\CreateOrderLis;
use DionONE\Slack\Listeners\CreateParentLis;
use DionONE\Slack\Listeners\CreatePortfolioLis;
use DionONE\Slack\Listeners\CreatePreventiveMaintenanceLis;
use DionONE\Slack\Listeners\CreateProjectBugLis;
use DionONE\Slack\Listeners\CreateProjectLis;
use DionONE\Slack\Listeners\CreateProjectMilestoneLis;
use DionONE\Slack\Listeners\CreateProjectTaskLis;
use DionONE\Slack\Listeners\CreatePurchaseInvoiceLis;
use DionONE\Slack\Listeners\CreateRetainerLis;
use DionONE\Slack\Listeners\CreateRetainerPaymentLis;
use DionONE\Slack\Listeners\CreateRevenueLis;
use DionONE\Slack\Listeners\CreateSalesInvoiceLis;
use DionONE\Slack\Listeners\CreateSalesMeetingLis;
use DionONE\Slack\Listeners\CreateSalesOrderLis;
use DionONE\Slack\Listeners\CreateSalesProposalLis;
use DionONE\Slack\Listeners\CreateSalesQuoteLis;
use DionONE\Slack\Listeners\CreateSpreadsheetLis;
use DionONE\Slack\Listeners\CreateStudentLis;
use DionONE\Slack\Listeners\CreateSubjectLis;
use DionONE\Slack\Listeners\CreateSupplierLis;
use DionONE\Slack\Listeners\CreateTaskCommentLis;
use DionONE\Slack\Listeners\CreateTimesheetLis;
use DionONE\Slack\Listeners\CreateTimeTrackerLis;
use DionONE\Slack\Listeners\CreateToDoLis;
use DionONE\Slack\Listeners\CreateTrainerLis;
use DionONE\Slack\Listeners\CreateUserLis;
use DionONE\Slack\Listeners\CreateVendorLis;
use DionONE\Slack\Listeners\CreateVisitorLis;
use DionONE\Slack\Listeners\CreateWarehouseLis;
use DionONE\Slack\Listeners\CreateWoocommerceProductLis;
use DionONE\Slack\Listeners\CreateWorkorderLis;
use DionONE\Slack\Listeners\CreateWorkrequestLis;
use DionONE\Slack\Listeners\CreateZoommeetingLis;
use DionONE\Slack\Listeners\DealMovedLis;
use DionONE\Slack\Listeners\FormConvertedLis;
use DionONE\Slack\Listeners\LeadConvertDealLis;
use DionONE\Slack\Listeners\LeadMovedLis;
use DionONE\Slack\Listeners\PostSalesInvoiceLis;
use DionONE\Slack\Listeners\SentSalesProposalLis;
use DionONE\Slack\Listeners\UpdateProjectTaskStageLis;
use DionONE\Spreadsheet\Events\CreateSpreadsheet;
use DionONE\Taskly\Events\CreateProject;
use DionONE\Taskly\Events\CreateProjectBug;
use DionONE\Taskly\Events\CreateProjectMilestone;
use DionONE\Taskly\Events\CreateProjectTask;
use DionONE\Taskly\Events\CreateTaskComment;
use DionONE\Taskly\Events\UpdateProjectTaskStage;
use DionONE\Timesheet\Events\CreateTimesheet;
use DionONE\TimeTracker\Events\CreateTimeTracker;
use DionONE\ToDo\Events\CompleteToDo;
use DionONE\ToDo\Events\CreateToDo;
use DionONE\Training\Events\CreateTrainer;
use DionONE\VisitorManagement\Events\CreateVisitor;
use DionONE\WordpressWoocommerce\Events\CreateWoocommerceProduct;
use DionONE\ZoomMeeting\Events\CreateZoomMeeting;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        CreateUser::class => [
            CreateUserLis::class,
        ],
        CreateSalesInvoice::class => [
            CreateSalesInvoiceLis::class
        ],
        PostSalesInvoice::class => [
            PostSalesInvoiceLis::class
        ],
        CreateSalesProposal::class => [
            CreateSalesProposalLis::class
        ],
        SentSalesProposal::class => [
            SentSalesProposalLis::class
        ],
        CreatePurchaseInvoice::class => [
            CreatePurchaseInvoiceLis::class
        ],
        CreateWarehouse::class => [
            CreateWarehouseLis::class
        ],
        CreateCustomer::class => [
            CreateCustomerLis::class
        ],
        CreateVendor::class => [
            CreateVendorLis::class
        ],
        CreateRevenue::class => [
            CreateRevenueLis::class
        ],
        CreateAppointment::class => [
            CreateAppointmentLis::class
        ],
        AppointmentStatus::class => [
            AppointmentStatusLis::class
        ],
        CreateWorkrequest::class => [
            CreateWorkrequestLis::class
        ],
        CreateSupplier::class => [
            CreateSupplierLis::class
        ],
        CreateCmmsPos::class => [
            CreateCmmsPosLis::class
        ],
        CreateWorkOrder::class => [
            CreateWorkorderLis::class
        ],
        CreateComponent::class => [
            CreateComponentLis::class
        ],
        CreateLocation::class => [
            CreateLocationLis::class
        ],
        CreatePreventiveMaintenance::class => [
            CreatePreventiveMaintenanceLis::class
        ],
        CreateContract::class => [
            CreateContractLis::class
        ],
        CreateAward::class => [
            CreateAwardLis::class,
        ],
        CreateLead::class => [
            CreateLeadLis::class
        ],
        LeadConvertDeal::class => [
            LeadConvertDealLis::class
        ],
        CreateDeal::class => [
            CreateDealLis::class
        ],
        LeadMoved::class => [
            LeadMovedLis::class
        ],
        DealMoved::class => [
            DealMovedLis::class
        ],
        CreateCandidate::class => [
            CreateCandidateLis::class
        ],
        CreateInterview::class => [
            CreateInterviewLis::class
        ],
        ConvertOfferToEmployee::class => [
            ConvertOfferToEmployeeLis::class
        ],
        CreateJobPosting::class => [
            CreateJobPostingLis::class
        ],
        CreateRetainer::class => [
            CreateRetainerLis::class
        ],
        CreateRetainerPayment::class => [
            CreateRetainerPaymentLis::class
        ],
        CreateSalesQuote::class => [
            CreateSalesQuoteLis::class
        ],
        CreateSalesOrder::class => [
            CreateSalesOrderLis::class
        ],
        CreateSalesMeeting::class => [
            CreateSalesMeetingLis::class
        ],
        CreateProject::class => [
            CreateProjectLis::class
        ],
        CreateProjectTask::class => [
            CreateProjectTaskLis::class
        ],
        CreateProjectBug::class => [
            CreateProjectBugLis::class
        ],
        CreateProjectMilestone::class => [
            CreateProjectMilestoneLis::class
        ],
        UpdateProjectTaskStage::class => [
            UpdateProjectTaskStageLis::class
        ],
        CreateTaskComment::class => [
            CreateTaskCommentLis::class
        ],
        CreateTrainer::class => [
            CreateTrainerLis::class
        ],
        CreateZoomMeeting::class => [
            CreateZoommeetingLis::class
        ],
        CreatePortfolio::class => [
            CreatePortfolioLis::class
        ],
        CreateSpreadsheet::class => [
            CreateSpreadsheetLis::class
        ],
        CreateFixEquipmentAccessory::class => [
            CreateFixEquipmentAccessoryLis::class
        ],
        CreateFixEquipmentAsset::class => [
            CreateFixEquipmentAssetLis::class
        ],
        CreateFixEquipmentAudit::class => [
            CreateFixEquipmentAuditLis::class
        ],
        CreateFixEquipmentComponent::class => [
            CreateFixEquipmentComponentLis::class
        ],
        CreateFixEquipmentConsumable::class => [
            CreateFixEquipmentConsumableLis::class
        ],
        CreateFixEquipmentLicense::class => [
            CreateFixEquipmentLicenseLis::class
        ],
        CreateFixEquipmentLocation::class => [
            CreateFixEquipmentLocationLis::class
        ],
        CreateFixEquipmentMaintenance::class => [
            CreateFixEquipmentMaintenanceLis::class
        ],
        CreateVisitor::class => [
            CreateVisitorLis::class
        ],
        CreateWoocommerceProduct::class => [
            CreateWoocommerceProductLis::class
        ],
        CreateAdmission::class => [
            CreateAdmissionLis::class
        ],
        CreateParent::class => [
            CreateParentLis::class
        ],
        CreateStudent::class => [
            CreateStudentLis::class
        ],
        CreateHomework::class => [
            CreateHomeworkLis::class
        ],
        CreateSubject::class => [
            CreateSubjectLis::class
        ],
        CreateClassTimetable::class => [
            CreateClassTimetableLis::class
        ],
        CreateCleaningTeam::class => [
            CreateCleaningTeamLis::class
        ],
        CreateCleaningBooking::class => [
            CreateCleaningBookingLis::class
        ],
        CreateCleaningInvoice::class => [
            CreateCleaningInvoiceLis::class
        ],
        CreateTimeTracker::class => [
            CreateTimeTrackerLis::class
        ],
        CreateMachine::class => [
            CreateMachineLis::class
        ],
        CreateMachineRepairRequest::class => [
            CreateMachineRepairRequestLis::class
        ],
        CreateHospitalDoctor::class => [
            CreateHospitalDoctorLis::class
        ],
        CreateHospitalPatient::class => [
            CreateHospitalPatientLis::class
        ],
        CreateHospitalAppointment::class => [
            CreateHospitalAppointmentLis::class
        ],
        CreateHospitalMedicine::class => [
            CreateHospitalMedicineLis::class
        ],
        CreateForm::class => [
            CreateFormLis::class
        ],
        FormConverted::class => [
            FormConvertedLis::class
        ],
        CreateTimesheet::class => [
            CreateTimesheetLis::class
        ],
        CreateNote::class => [
            CreateNoteLis::class
        ],
        CreateInternalknowledgeArticle::class => [
            CreateInternalknowledgeArticleLis::class
        ],
        CreateInternalknowledgeBook::class => [
            CreateInternalknowledgeBookLis::class
        ],
        CreateCreativity::class => [
            CreateCreativityLis::class
        ],
        CreateChallenge::class => [
            CreateChallengeLis::class
        ],
        CreateCategory::class => [
            CreateCategoryLis::class
        ],
        CreateToDo::class => [
            CreateToDoLis::class
        ],
        CompleteToDo::class => [
            CompleteToDoLis::class
        ],
        CreateDocument::class => [
            CreateDocumentLis::class
        ],

    ];
}
