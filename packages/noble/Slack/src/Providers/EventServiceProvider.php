<?php

namespace Noble\Slack\Providers;

use App\Events\CreatePurchaseInvoice;
use App\Events\CreateSalesInvoice;
use App\Events\CreateSalesProposal;
use App\Events\CreateUser;
use App\Events\CreateWarehouse;
use App\Events\PostSalesInvoice;
use App\Events\SentSalesProposal;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Account\Events\CreateCustomer;
use Noble\Account\Events\CreateRevenue;
use Noble\Account\Events\CreateVendor;
use Noble\Appointment\Events\AppointmentStatus;
use Noble\Appointment\Events\CreateAppointment;
use Noble\CleaningManagement\Events\CreateCleaningBooking;
use Noble\CleaningManagement\Events\CreateCleaningInvoice;
use Noble\CleaningManagement\Events\CreateCleaningTeam;
use Noble\CMMS\Events\CreateCmmsPos;
use Noble\CMMS\Events\CreateComponent;
use Noble\CMMS\Events\CreateLocation;
use Noble\CMMS\Events\CreatePreventiveMaintenance;
use Noble\CMMS\Events\CreateSupplier;
use Noble\CMMS\Events\CreateWorkOrder;
use Noble\CMMS\Events\CreateWorkrequest;
use Noble\Contract\Events\CreateContract;
use Noble\Documents\Events\CreateDocument;
use Noble\FixEquipment\Events\CreateFixEquipmentAccessory;
use Noble\FixEquipment\Events\CreateFixEquipmentAsset;
use Noble\FixEquipment\Events\CreateFixEquipmentAudit;
use Noble\FixEquipment\Events\CreateFixEquipmentComponent;
use Noble\FixEquipment\Events\CreateFixEquipmentConsumable;
use Noble\FixEquipment\Events\CreateFixEquipmentLicense;
use Noble\FixEquipment\Events\CreateFixEquipmentLocation;
use Noble\FixEquipment\Events\CreateFixEquipmentMaintenance;
use Noble\FormBuilder\Events\CreateForm;
use Noble\FormBuilder\Events\FormConverted;
use Noble\HospitalManagement\Events\CreateHospitalAppointment;
use Noble\HospitalManagement\Events\CreateHospitalDoctor;
use Noble\HospitalManagement\Events\CreateHospitalMedicine;
use Noble\HospitalManagement\Events\CreateHospitalPatient;
use Noble\Hrm\Events\CreateAward;
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
use Noble\Portfolio\Events\CreatePortfolio;
use Noble\Recruitment\Events\ConvertOfferToEmployee;
use Noble\Recruitment\Events\CreateCandidate;
use Noble\Recruitment\Events\CreateInterview;
use Noble\Recruitment\Events\CreateJobPosting;
use Noble\Retainer\Events\CreateRetainer;
use Noble\Retainer\Events\CreateRetainerPayment;
use Noble\Sales\Events\CreateSalesMeeting;
use Noble\Sales\Events\CreateSalesOrder;
use Noble\Sales\Events\CreateSalesQuote;
use Noble\School\Events\CreateAdmission;
use Noble\School\Events\CreateClassTimetable;
use Noble\School\Events\CreateHomework;
use Noble\School\Events\CreateParent;
use Noble\School\Events\CreateStudent;
use Noble\School\Events\CreateSubject;
use Noble\Slack\Listeners\AppointmentStatusLis;
use Noble\Slack\Listeners\CompleteToDoLis;
use Noble\Slack\Listeners\ConvertOfferToEmployeeLis;
use Noble\Slack\Listeners\CreateAdmissionLis;
use Noble\Slack\Listeners\CreateAppointmentLis;
use Noble\Slack\Listeners\CreateAwardLis;
use Noble\Slack\Listeners\CreateCandidateLis;
use Noble\Slack\Listeners\CreateCategoryLis;
use Noble\Slack\Listeners\CreateChallengeLis;
use Noble\Slack\Listeners\CreateClassTimetableLis;
use Noble\Slack\Listeners\CreateCleaningBookingLis;
use Noble\Slack\Listeners\CreateCleaningInvoiceLis;
use Noble\Slack\Listeners\CreateCleaningTeamLis;
use Noble\Slack\Listeners\CreateCmmsPosLis;
use Noble\Slack\Listeners\CreateComponentLis;
use Noble\Slack\Listeners\CreateContractLis;
use Noble\Slack\Listeners\CreateCourseLis;
use Noble\Slack\Listeners\CreateCreativityLis;
use Noble\Slack\Listeners\CreateCustomerLis;
use Noble\Slack\Listeners\CreateCustomPageLis;
use Noble\Slack\Listeners\CreateDealLis;
use Noble\Slack\Listeners\CreateDocumentLis;
use Noble\Slack\Listeners\CreateFixEquipmentAccessoryLis;
use Noble\Slack\Listeners\CreateFixEquipmentAssetLis;
use Noble\Slack\Listeners\CreateFixEquipmentAuditLis;
use Noble\Slack\Listeners\CreateFixEquipmentComponentLis;
use Noble\Slack\Listeners\CreateFixEquipmentConsumableLis;
use Noble\Slack\Listeners\CreateFixEquipmentLicenseLis;
use Noble\Slack\Listeners\CreateFixEquipmentLocationLis;
use Noble\Slack\Listeners\CreateFixEquipmentMaintenanceLis;
use Noble\Slack\Listeners\CreateFormLis;
use Noble\Slack\Listeners\CreateHistoryLis;
use Noble\Slack\Listeners\CreateHomeworkLis;
use Noble\Slack\Listeners\CreateHospitalAppointmentLis;
use Noble\Slack\Listeners\CreateHospitalDoctorLis;
use Noble\Slack\Listeners\CreateHospitalMedicineLis;
use Noble\Slack\Listeners\CreateHospitalPatientLis;
use Noble\Slack\Listeners\CreateInternalknowledgeArticleLis;
use Noble\Slack\Listeners\CreateInternalknowledgeBookLis;
use Noble\Slack\Listeners\CreateInterviewLis;
use Noble\Slack\Listeners\CreateJobPostingLis;
use Noble\Slack\Listeners\CreateLeadLis;
use Noble\Slack\Listeners\CreateLocationLis;
use Noble\Slack\Listeners\CreateMachineLis;
use Noble\Slack\Listeners\CreateMachineRepairRequestLis;
use Noble\Slack\Listeners\CreateNoteLis;
use Noble\Slack\Listeners\CreateOrderLis;
use Noble\Slack\Listeners\CreateParentLis;
use Noble\Slack\Listeners\CreatePortfolioLis;
use Noble\Slack\Listeners\CreatePreventiveMaintenanceLis;
use Noble\Slack\Listeners\CreateProjectBugLis;
use Noble\Slack\Listeners\CreateProjectLis;
use Noble\Slack\Listeners\CreateProjectMilestoneLis;
use Noble\Slack\Listeners\CreateProjectTaskLis;
use Noble\Slack\Listeners\CreatePurchaseInvoiceLis;
use Noble\Slack\Listeners\CreateRetainerLis;
use Noble\Slack\Listeners\CreateRetainerPaymentLis;
use Noble\Slack\Listeners\CreateRevenueLis;
use Noble\Slack\Listeners\CreateSalesInvoiceLis;
use Noble\Slack\Listeners\CreateSalesMeetingLis;
use Noble\Slack\Listeners\CreateSalesOrderLis;
use Noble\Slack\Listeners\CreateSalesProposalLis;
use Noble\Slack\Listeners\CreateSalesQuoteLis;
use Noble\Slack\Listeners\CreateSpreadsheetLis;
use Noble\Slack\Listeners\CreateStudentLis;
use Noble\Slack\Listeners\CreateSubjectLis;
use Noble\Slack\Listeners\CreateSupplierLis;
use Noble\Slack\Listeners\CreateTaskCommentLis;
use Noble\Slack\Listeners\CreateTimesheetLis;
use Noble\Slack\Listeners\CreateTimeTrackerLis;
use Noble\Slack\Listeners\CreateToDoLis;
use Noble\Slack\Listeners\CreateTrainerLis;
use Noble\Slack\Listeners\CreateUserLis;
use Noble\Slack\Listeners\CreateVendorLis;
use Noble\Slack\Listeners\CreateVisitorLis;
use Noble\Slack\Listeners\CreateWarehouseLis;
use Noble\Slack\Listeners\CreateWoocommerceProductLis;
use Noble\Slack\Listeners\CreateWorkorderLis;
use Noble\Slack\Listeners\CreateWorkrequestLis;
use Noble\Slack\Listeners\CreateZoommeetingLis;
use Noble\Slack\Listeners\DealMovedLis;
use Noble\Slack\Listeners\FormConvertedLis;
use Noble\Slack\Listeners\LeadConvertDealLis;
use Noble\Slack\Listeners\LeadMovedLis;
use Noble\Slack\Listeners\PostSalesInvoiceLis;
use Noble\Slack\Listeners\SentSalesProposalLis;
use Noble\Slack\Listeners\UpdateProjectTaskStageLis;
use Noble\Spreadsheet\Events\CreateSpreadsheet;
use Noble\Taskly\Events\CreateProject;
use Noble\Taskly\Events\CreateProjectBug;
use Noble\Taskly\Events\CreateProjectMilestone;
use Noble\Taskly\Events\CreateProjectTask;
use Noble\Taskly\Events\CreateTaskComment;
use Noble\Taskly\Events\UpdateProjectTaskStage;
use Noble\Timesheet\Events\CreateTimesheet;
use Noble\TimeTracker\Events\CreateTimeTracker;
use Noble\ToDo\Events\CompleteToDo;
use Noble\ToDo\Events\CreateToDo;
use Noble\Training\Events\CreateTrainer;
use Noble\VisitorManagement\Events\CreateVisitor;
use Noble\WordpressWoocommerce\Events\CreateWoocommerceProduct;
use Noble\ZoomMeeting\Events\CreateZoomMeeting;

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
