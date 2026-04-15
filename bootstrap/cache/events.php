<?php return array (
  'Noble\\AIAssistant\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\Account\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Account\\Listeners\\DataDefault',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Account\\Listeners\\GiveRoleToPermission',
    ),
    'App\\Events\\PostPurchaseInvoice' => 
    array (
      0 => 'Noble\\Account\\Listeners\\PostPurchaseInvoiceListener',
    ),
    'App\\Events\\PostSalesInvoice' => 
    array (
      0 => 'Noble\\Account\\Listeners\\PostSalesInvoiceListener',
    ),
    'App\\Events\\CreateTransfer' => 
    array (
      0 => 'Noble\\Account\\Listeners\\CreateTransferListener',
    ),
    'App\\Events\\DestroyTransfer' => 
    array (
      0 => 'Noble\\Account\\Listeners\\DestroyTransferListener',
    ),
    'App\\Events\\ApprovePurchaseReturn' => 
    array (
      0 => 'Noble\\Account\\Listeners\\CreateDebitNoteFromReturn',
    ),
    'App\\Events\\ApproveSalesReturn' => 
    array (
      0 => 'Noble\\Account\\Listeners\\CreateCreditNoteFromReturn',
    ),
    'Noble\\Retainer\\Events\\UpdateRetainerPaymentStatus' => 
    array (
      0 => 'Noble\\Account\\Listeners\\UpdateRetainerPaymentStatusListener',
    ),
    'Noble\\Retainer\\Events\\ConvertSalesRetainer' => 
    array (
      0 => 'Noble\\Account\\Listeners\\ConvertSalesRetainerListener',
    ),
    'Noble\\Commission\\Events\\CreateCommissionPayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\Commission\\Events\\UpdateCommissionPaymentStatus' => 
    array (
      0 => 'Noble\\Account\\Listeners\\UpdateCommissionPaymentStatusListener',
    ),
    'Noble\\Hrm\\Events\\PaySalary' => 
    array (
      0 => 'Noble\\Account\\Listeners\\PaySalaryListener',
    ),
    'Noble\\Pos\\Events\\CreatePos' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
      1 => 'Noble\\Account\\Listeners\\CreatePosListener',
    ),
    'Noble\\MobileServiceManagement\\Events\\CreateMobileServicePayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\MobileServiceManagement\\Events\\UpdateMobileServicePaymentStatus' => 
    array (
      0 => 'Noble\\Account\\Listeners\\UpdateMobileServicePaymentStatusLis',
    ),
    'Noble\\Fleet\\Events\\CraeteFleetBookingPayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\Fleet\\Events\\MarkFleetBookingPaymentPaid' => 
    array (
      0 => 'Noble\\Account\\Listeners\\MarkFleetBookingPaymentPaidListener',
    ),
    'Noble\\Stripe\\Events\\BeautyBookingPaymentStripe' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BeautyBookingPaymentListener',
    ),
    'Noble\\Paypal\\Events\\BeautyBookingPaymentPaypal' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BeautyBookingPaymentListener',
    ),
    'Noble\\DairyCattleManagement\\Events\\CreateDairyCattlePayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\DairyCattleManagement\\Events\\UpdateDairyCattlePaymentStatus' => 
    array (
      0 => 'Noble\\Account\\Listeners\\UpdateDairyCattlePaymentStatusListener',
    ),
    'Noble\\CateringManagement\\Events\\CreateCateringOrderPayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\CateringManagement\\Events\\UpdateCateringOrderPaymentStatus' => 
    array (
      0 => 'Noble\\Account\\Listeners\\UpdateCateringOrderPaymentStatusListener',
    ),
    'Noble\\PropertyManagement\\Events\\CreatePropertyPayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\Hrm\\Events\\CreatePayroll' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\Hrm\\Events\\UpdatePayroll' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\SalesAgent\\Events\\CreateSalesAgentCommissionPayment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\BankAccountFieldUpdate',
    ),
    'Noble\\SalesAgent\\Events\\UpdateSalesAgentCommissionPaymentStatus' => 
    array (
      0 => 'Noble\\Account\\Listeners\\UpdateSalesAgentCommissionPaymentStatusLis',
    ),
    'Noble\\SalesAgent\\Events\\ApproveSalesAgentCommissionAdjustment' => 
    array (
      0 => 'Noble\\Account\\Listeners\\ApproveSalesAgentCommissionAdjustmentLis',
    ),
  ),
  'Noble\\BudgetPlanner\\Providers\\EventServiceProvider' => 
  array (
    'Noble\\Account\\Events\\UpdateBudgetSpending' => 
    array (
      0 => 'Noble\\BudgetPlanner\\Listeners\\UpdateBudgetSpendingLis',
    ),
  ),
  'Noble\\Calendar\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\DataDefault',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\GiveRoleToPermission',
    ),
    'Noble\\Lead\\Events\\CreateDealTask' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateDealTaskLis',
    ),
    'Noble\\Lead\\Events\\CreateLeadTask' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateLeadTaskLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkOrder' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateWorkorderLis',
    ),
    'Noble\\Appointment\\Events\\AppointmentStatus' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateAppointmentStatusListener',
    ),
    'Noble\\Contract\\Events\\CreateContract' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateContractListener',
    ),
    'Noble\\GoogleMeet\\Events\\CreateGoogleMeeting' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateGoogleMeetingListener',
    ),
    'Noble\\HospitalManagement\\Events\\UpdateHospitalAppointmentStatus' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateHospitalAppointmentListener',
    ),
    'Noble\\ZoomMeeting\\Events\\CreateZoomMeeting' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateZoomMeetingListener',
    ),
    'Noble\\Sales\\Events\\CreateSalesCall' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateSalesCallListener',
    ),
    'Noble\\Sales\\Events\\CreateSalesMeeting' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateSalesMeetingListener',
    ),
    'Noble\\School\\Events\\CreateEvent' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateSchoolEventListener',
    ),
    'Noble\\Taskly\\Events\\CreateProjectTask' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateProjectTaskListener',
    ),
    'Noble\\ToDo\\Events\\CreateToDo' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateToDoListener',
    ),
    'Noble\\TeamWorkload\\Events\\CreateTeamWorkloadHoliday' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateTeamWorkloadHolidayListener',
    ),
    'Noble\\Recruitment\\Events\\CreateInterview' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateInterviewListener',
    ),
    'Noble\\Hrm\\Events\\CreateLeaveApplication' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateLeaveApplicationListener',
    ),
    'Noble\\Hrm\\Events\\CreateEvent' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateEventListener',
    ),
    'App\\Events\\CreateSalesInvoice' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreateSalesInvoiceListener',
    ),
    'App\\Events\\CreatePurchaseInvoice' => 
    array (
      0 => 'Noble\\Calendar\\Listeners\\CreatePurchaseInvoiceListener',
    ),
  ),
  'Noble\\Contract\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Contract\\Listeners\\DataDefault',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Contract\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\DoubleEntry\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\FormBuilder\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\FormBuilder\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Goal\\Providers\\EventServiceProvider' => 
  array (
    'Noble\\Account\\Events\\UpdateBudgetSpending' => 
    array (
      0 => 'Noble\\Goal\\Listeners\\UpdateBudgetSpendingLis',
    ),
  ),
  'Noble\\GoogleCaptcha\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\Hrm\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Hrm\\Listeners\\DataDefault',
    ),
    'App\\Events\\CreateUser' => 
    array (
      0 => 'Noble\\Hrm\\Listeners\\CreateEmployeeFromUser',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Hrm\\Listeners\\GiveRoleToPermission',
    ),
    'App\\Events\\UpdateUser' => 
    array (
      0 => 'Noble\\Hrm\\Listeners\\UpdateEmployeeFromUser',
    ),
    'App\\Events\\DestroyUser' => 
    array (
      0 => 'Noble\\Hrm\\Listeners\\DestroyEmployeeFromUser',
    ),
  ),
  'Noble\\Lead\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Lead\\Listeners\\GiveRoleToPermission',
    ),
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Lead\\Listeners\\DataDefault',
    ),
  ),
  'Noble\\Paypal\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\Performance\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Performance\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Pos\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\ProductService\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\PostPurchaseInvoice' => 
    array (
      0 => 'Noble\\ProductService\\Listeners\\PostPurchaseInvoiceListener',
    ),
    'App\\Events\\PostSalesInvoice' => 
    array (
      0 => 'Noble\\ProductService\\Listeners\\PostSalesInvoiceListener',
    ),
    'App\\Events\\ApprovePurchaseReturn' => 
    array (
      0 => 'Noble\\ProductService\\Listeners\\ApprovePurchaseReturnListener',
    ),
    'App\\Events\\CompleteSalesReturn' => 
    array (
      0 => 'Noble\\ProductService\\Listeners\\CompleteSalesReturnListener',
    ),
    'Noble\\Pos\\Events\\CreatePos' => 
    array (
      0 => 'Noble\\ProductService\\Listeners\\PosCreateListener',
    ),
    'Noble\\Retainer\\Events\\ConvertSalesRetainer' => 
    array (
      0 => 'Noble\\ProductService\\Listeners\\CompleteSalesReturnListener',
    ),
  ),
  'Noble\\Quotation\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Quotation\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Recruitment\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Recruitment\\Listeners\\DataDefault',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Recruitment\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Slack\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\CreateUser' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateUserLis',
    ),
    'App\\Events\\CreateSalesInvoice' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSalesInvoiceLis',
    ),
    'App\\Events\\PostSalesInvoice' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\PostSalesInvoiceLis',
    ),
    'App\\Events\\CreateSalesProposal' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSalesProposalLis',
    ),
    'App\\Events\\SentSalesProposal' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\SentSalesProposalLis',
    ),
    'App\\Events\\CreatePurchaseInvoice' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreatePurchaseInvoiceLis',
    ),
    'App\\Events\\CreateWarehouse' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateWarehouseLis',
    ),
    'Noble\\Account\\Events\\CreateCustomer' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCustomerLis',
    ),
    'Noble\\Account\\Events\\CreateVendor' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateVendorLis',
    ),
    'Noble\\Account\\Events\\CreateRevenue' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateRevenueLis',
    ),
    'Noble\\Appointment\\Events\\CreateAppointment' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateAppointmentLis',
    ),
    'Noble\\Appointment\\Events\\AppointmentStatus' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\AppointmentStatusLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkrequest' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateWorkrequestLis',
    ),
    'Noble\\CMMS\\Events\\CreateSupplier' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSupplierLis',
    ),
    'Noble\\CMMS\\Events\\CreateCmmsPos' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCmmsPosLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkOrder' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateWorkorderLis',
    ),
    'Noble\\CMMS\\Events\\CreateComponent' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateComponentLis',
    ),
    'Noble\\CMMS\\Events\\CreateLocation' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateLocationLis',
    ),
    'Noble\\CMMS\\Events\\CreatePreventiveMaintenance' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreatePreventiveMaintenanceLis',
    ),
    'Noble\\Contract\\Events\\CreateContract' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateContractLis',
    ),
    'Noble\\Hrm\\Events\\CreateAward' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateAwardLis',
    ),
    'Noble\\Lead\\Events\\CreateLead' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateLeadLis',
    ),
    'Noble\\Lead\\Events\\LeadConvertDeal' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\LeadConvertDealLis',
    ),
    'Noble\\Lead\\Events\\CreateDeal' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateDealLis',
    ),
    'Noble\\Lead\\Events\\LeadMoved' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\LeadMovedLis',
    ),
    'Noble\\Lead\\Events\\DealMoved' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\DealMovedLis',
    ),
    'Noble\\Recruitment\\Events\\CreateCandidate' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCandidateLis',
    ),
    'Noble\\Recruitment\\Events\\CreateInterview' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateInterviewLis',
    ),
    'Noble\\Recruitment\\Events\\ConvertOfferToEmployee' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\ConvertOfferToEmployeeLis',
    ),
    'Noble\\Recruitment\\Events\\CreateJobPosting' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateJobPostingLis',
    ),
    'Noble\\Retainer\\Events\\CreateRetainer' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateRetainerLis',
    ),
    'Noble\\Retainer\\Events\\CreateRetainerPayment' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateRetainerPaymentLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesQuote' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSalesQuoteLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesOrder' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSalesOrderLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesMeeting' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSalesMeetingLis',
    ),
    'Noble\\Taskly\\Events\\CreateProject' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateProjectLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectTask' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateProjectTaskLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectBug' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateProjectBugLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectMilestone' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateProjectMilestoneLis',
    ),
    'Noble\\Taskly\\Events\\UpdateProjectTaskStage' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\UpdateProjectTaskStageLis',
    ),
    'Noble\\Taskly\\Events\\CreateTaskComment' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateTaskCommentLis',
    ),
    'Noble\\Training\\Events\\CreateTrainer' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateTrainerLis',
    ),
    'Noble\\ZoomMeeting\\Events\\CreateZoomMeeting' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateZoommeetingLis',
    ),
    'Noble\\Portfolio\\Events\\CreatePortfolio' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreatePortfolioLis',
    ),
    'Noble\\Spreadsheet\\Events\\CreateSpreadsheet' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSpreadsheetLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAccessory' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentAccessoryLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAsset' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentAssetLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAudit' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentAuditLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentComponent' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentComponentLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentConsumable' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentConsumableLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentLicense' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentLicenseLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentLocation' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentLocationLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentMaintenance' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFixEquipmentMaintenanceLis',
    ),
    'Noble\\VisitorManagement\\Events\\CreateVisitor' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateVisitorLis',
    ),
    'Noble\\WordpressWoocommerce\\Events\\CreateWoocommerceProduct' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateWoocommerceProductLis',
    ),
    'Noble\\School\\Events\\CreateAdmission' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateAdmissionLis',
    ),
    'Noble\\School\\Events\\CreateParent' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateParentLis',
    ),
    'Noble\\School\\Events\\CreateStudent' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateStudentLis',
    ),
    'Noble\\School\\Events\\CreateHomework' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateHomeworkLis',
    ),
    'Noble\\School\\Events\\CreateSubject' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateSubjectLis',
    ),
    'Noble\\School\\Events\\CreateClassTimetable' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateClassTimetableLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningTeam' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCleaningTeamLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningBooking' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCleaningBookingLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningInvoice' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCleaningInvoiceLis',
    ),
    'Noble\\TimeTracker\\Events\\CreateTimeTracker' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateTimeTrackerLis',
    ),
    'Noble\\MachineRepairManagement\\Events\\CreateMachine' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateMachineLis',
    ),
    'Noble\\MachineRepairManagement\\Events\\CreateMachineRepairRequest' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateMachineRepairRequestLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalDoctor' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateHospitalDoctorLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalPatient' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateHospitalPatientLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalAppointment' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateHospitalAppointmentLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalMedicine' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateHospitalMedicineLis',
    ),
    'Noble\\FormBuilder\\Events\\CreateForm' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateFormLis',
    ),
    'Noble\\FormBuilder\\Events\\FormConverted' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\FormConvertedLis',
    ),
    'Noble\\Timesheet\\Events\\CreateTimesheet' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateTimesheetLis',
    ),
    'Noble\\Notes\\Events\\CreateNote' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateNoteLis',
    ),
    'Noble\\Internalknowledge\\Events\\CreateInternalknowledgeArticle' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateInternalknowledgeArticleLis',
    ),
    'Noble\\Internalknowledge\\Events\\CreateInternalknowledgeBook' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateInternalknowledgeBookLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateCreativity' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCreativityLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateChallenge' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateChallengeLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateCategory' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateCategoryLis',
    ),
    'Noble\\ToDo\\Events\\CreateToDo' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateToDoLis',
    ),
    'Noble\\ToDo\\Events\\CompleteToDo' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CompleteToDoLis',
    ),
    'Noble\\Documents\\Events\\CreateDocument' => 
    array (
      0 => 'Noble\\Slack\\Listeners\\CreateDocumentLis',
    ),
  ),
  'Noble\\Stripe\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\SupportTicket\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\SupportTicket\\Listeners\\DataDefault',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\SupportTicket\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Taskly\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\DefaultData' => 
    array (
      0 => 'Noble\\Taskly\\Listeners\\DataDefault',
    ),
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Taskly\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Telegram\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\CreateUser' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateUserLis',
    ),
    'App\\Events\\PostSalesInvoice' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\PostSalesInvoiceLis',
    ),
    'App\\Events\\SentSalesProposal' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\SentSalesProposalLis',
    ),
    'App\\Events\\CreatePurchaseInvoice' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreatePurchaseInvoiceLis',
    ),
    'App\\Events\\CreateWarehouse' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateWarehouseLis',
    ),
    'App\\Events\\CreateSalesProposal' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSalesProposalLis',
    ),
    'Noble\\Account\\Events\\CreateCustomer' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCustomerLis',
    ),
    'Noble\\Account\\Events\\CreateVendor' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateVendorLis',
    ),
    'Noble\\Account\\Events\\CreateRevenue' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateRevenueLis',
    ),
    'Noble\\Account\\Events\\CreateBankTransfer' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateBankTransferLis',
    ),
    'Noble\\Appointment\\Events\\AppointmentStatus' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\AppointmentStatusLis',
    ),
    'Noble\\Appointment\\Events\\CreateSchedule' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateScheduleLis',
    ),
    'Noble\\CMMS\\Events\\CreateLocation' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateLocationLis',
    ),
    'Noble\\CMMS\\Events\\CreateSupplier' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSupplierLis',
    ),
    'Noble\\CMMS\\Events\\CreateComponent' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateComponentLis',
    ),
    'Noble\\CMMS\\Events\\CreatePreventiveMaintenance' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreatePreventiveMaintenanceLis',
    ),
    'Noble\\CMMS\\Events\\CreateCmmsPos' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCmmsPosLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkOrder' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateWorkorderLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkRequest' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateWorkRequestLis',
    ),
    'Noble\\Contract\\Events\\CreateContract' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateContractLis',
    ),
    'Noble\\Hrm\\Events\\CreatePayroll' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreatePayrollLis',
    ),
    'Noble\\Hrm\\Events\\CreateAward' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateAwardLis',
    ),
    'Noble\\Hrm\\Events\\CreateEvent' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateEventLis',
    ),
    'Noble\\Hrm\\Events\\UpdateLeaveStatus' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\UpdateLeaveStatusLis',
    ),
    'Noble\\Hrm\\Events\\CreateAnnouncement' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateAnnouncementLis',
    ),
    'Noble\\Hrm\\Events\\CreateHoliday' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHolidayLis',
    ),
    'Noble\\Lead\\Events\\CreateLead' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateLeadLis',
    ),
    'Noble\\Lead\\Events\\LeadConvertDeal' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\LeadConvertDealLis',
    ),
    'Noble\\Lead\\Events\\CreateDeal' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateDealLis',
    ),
    'Noble\\Lead\\Events\\LeadMoved' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\LeadMovedLis',
    ),
    'Noble\\Lead\\Events\\DealMoved' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\DealMovedLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesQuote' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSalesQuoteLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesOrder' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSalesOrderLis',
    ),
    'App\\Events\\CreateSalesInvoice' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSalesInvoiceLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesMeeting' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSalesMeetingLis',
    ),
    'Noble\\Taskly\\Events\\CreateProject' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateProjectLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectTask' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateProjectTaskLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectBug' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateProjectBugLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectMilestone' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateProjectMilestoneLis',
    ),
    'Noble\\Taskly\\Events\\UpdateProjectTaskStage' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\UpdateProjectTaskStageLis',
    ),
    'Noble\\Taskly\\Events\\UpdateTaskStage' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\UpdateTaskStageLis',
    ),
    'Noble\\Taskly\\Events\\CreateTaskComment' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateTaskCommentLis',
    ),
    'Noble\\ZoomMeeting\\Events\\CreateZoomMeeting' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateZoommeetingLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAccessory' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentAccessoryLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAsset' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentAssetLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAudit' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentAuditLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentComponent' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentComponentLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentConsumable' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentConsumableLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentLicense' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentLicenseLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentLocation' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentLocationLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentMaintenance' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateFixEquipmentMaintenanceLis',
    ),
    'Noble\\VisitorManagement\\Events\\CreateVisitor' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateVisitorLis',
    ),
    'Noble\\VisitorManagement\\Events\\CreateVisitPurpose' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateVisitPurposeLis',
    ),
    'Noble\\Feedback\\Events\\CreateTemplate' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateTemplateLis',
    ),
    'Noble\\Feedback\\Events\\CreateHistory' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHistoryLis',
    ),
    'Noble\\School\\Events\\CreateEmployee' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSchoolEmployeeLis',
    ),
    'Noble\\School\\Events\\CreateAdmission' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateAdmissionLis',
    ),
    'Noble\\School\\Events\\CreateParent' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateParentLis',
    ),
    'Noble\\School\\Events\\CreateStudent' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSchoolStudentLis',
    ),
    'Noble\\School\\Events\\CreateHomework' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHomeworkLis',
    ),
    'Noble\\School\\Events\\CreateSubject' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateSubjectLis',
    ),
    'Noble\\School\\Events\\CreateClassTimetable' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateClassTimetableLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningTeam' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCleaningTeamLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningBooking' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCleaningBookingLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningInvoice' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCleaningInvoiceLis',
    ),
    'Noble\\MachineRepairManagement\\Events\\CreateMachine' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateMachineLis',
    ),
    'Noble\\MachineRepairManagement\\Events\\CreateMachineRepairRequest' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateMachineRepairRequestLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalDoctor' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHospitalDoctorLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalPatient' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHospitalPatientLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalAppointment' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHospitalAppointmentLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalMedicine' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateHospitalMedicineLis',
    ),
    'Noble\\Timesheet\\Events\\CreateTimesheet' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateTimesheetLis',
    ),
    'Noble\\Notes\\Events\\CreateNote' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateNoteLis',
    ),
    'Noble\\Internalknowledge\\Events\\CreateInternalknowledgeArticle' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateInternalknowledgeArticleLis',
    ),
    'Noble\\Internalknowledge\\Events\\CreateInternalknowledgeBook' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateInternalknowledgeBookLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateCreativity' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCreativityLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateChallenge' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateChallengeLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateCategory' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateCategoryLis',
    ),
    'Noble\\ToDo\\Events\\CreateToDo' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateToDoLis',
    ),
    'Noble\\ToDo\\Events\\CompleteToDo' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CompleteToDoLis',
    ),
    'Noble\\Documents\\Events\\CreateDocument' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateDocumentLis',
    ),
    'Noble\\Documents\\Events\\StatusChangeDocument' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\StatusChangeDocumentLis',
    ),
    'Noble\\WordpressWoocommerce\\Events\\CreateWoocommerceProduct' => 
    array (
      0 => 'Noble\\Telegram\\Listeners\\CreateWoocommerceProductLis',
    ),
  ),
  'Noble\\Timesheet\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\Timesheet\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Noble\\Training\\Providers\\EventServiceProvider' => 
  array (
  ),
  'Noble\\Twilio\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\CreateUser' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateUserLis',
    ),
    'App\\Events\\CreateSalesInvoice' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateSalesInvoiceLis',
    ),
    'App\\Events\\PostSalesInvoice' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\PostSalesInvoiceLis',
    ),
    'App\\Events\\CreateSalesProposal' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateSalesProposalLis',
    ),
    'App\\Events\\SentSalesProposal' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\SentSalesProposalLis',
    ),
    'Noble\\Account\\Events\\CreateBankTransfer' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateBankTransferLis',
    ),
    'App\\Events\\CreatePurchaseInvoice' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreatePurchaseInvoiceLis',
    ),
    'App\\Events\\CreateWarehouse' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateWarehouseLis',
    ),
    'Noble\\Appointment\\Events\\AppointmentStatus' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\AppointmentStatusLis',
    ),
    'Noble\\Appointment\\Events\\CreateSchedule' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateScheduleLis',
    ),
    'Noble\\CMMS\\Events\\CreateCmmsPos' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCmmsPosLis',
    ),
    'Noble\\CMMS\\Events\\CreateComponent' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateComponentLis',
    ),
    'Noble\\CMMS\\Events\\CreateLocation' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateLocationLis',
    ),
    'Noble\\CMMS\\Events\\CreatePreventiveMaintenance' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreatePreventiveMaintenanceLis',
    ),
    'Noble\\CMMS\\Events\\CreateSupplier' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateSupplierLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkOrder' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateWorkOrderLis',
    ),
    'Noble\\CMMS\\Events\\CreateWorkRequest' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateWorkRequestLis',
    ),
    'Noble\\Contract\\Events\\CreateContract' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateContractLis',
    ),
    'Noble\\Lead\\Events\\CreateDeal' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateDealLis',
    ),
    'Noble\\Lead\\Events\\CreateLead' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateLeadLis',
    ),
    'Noble\\Lead\\Events\\DealMoved' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\DealMovedLis',
    ),
    'Noble\\Lead\\Events\\LeadConvertDeal' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\LeadConvertDealLis',
    ),
    'Noble\\Lead\\Events\\LeadMoved' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\LeadMovedLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesMeeting' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateSalesMeetingLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesQuote' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateSalesQuoteLis',
    ),
    'Noble\\Sales\\Events\\CreateSalesOrder' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateSalesOrderLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectBug' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateProjectBugLis',
    ),
    'Noble\\Taskly\\Events\\CreateProject' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateProjectLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectMilestone' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateProjectMilestoneLis',
    ),
    'Noble\\Taskly\\Events\\CreateProjectTask' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateProjectTaskLis',
    ),
    'Noble\\Taskly\\Events\\CreateTaskComment' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateTaskCommentLis',
    ),
    'Noble\\Taskly\\Events\\UpdateProjectTaskStage' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\UpdateProjectTaskStageLis',
    ),
    'Noble\\ZoomMeeting\\Events\\CreateZoomMeeting' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateZoomMeetingLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAccessory' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentAccessoryLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAsset' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentAssetLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentAudit' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentAuditLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentComponent' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentComponentLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentConsumable' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentConsumableLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentLicense' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentLicenseLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentMaintenance' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentMaintenanceLis',
    ),
    'Noble\\FixEquipment\\Events\\CreateFixEquipmentLocation' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateFixEquipmentLocationLis',
    ),
    'Noble\\VisitorManagement\\Events\\CreateVisitor' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateVisitorLis',
    ),
    'Noble\\VisitorManagement\\Events\\CreateVisitPurpose' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateVisitPurposeLis',
    ),
    'Noble\\WordpressWoocommerce\\Events\\CreateWoocommerceProduct' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateWoocommerceProductLis',
    ),
    'Noble\\Feedback\\Events\\CreateHistory' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHistoryLis',
    ),
    'Noble\\Feedback\\Events\\CreateTemplate' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateTemplateLis',
    ),
    'Noble\\School\\Events\\CreateAdmission' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateAdmissionLis',
    ),
    'Noble\\School\\Events\\CreateClassTimetable' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateClassTimetableLis',
    ),
    'Noble\\School\\Events\\CreateEmployee' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateEmployeeLis',
    ),
    'Noble\\School\\Events\\CreateHomework' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHomeworkLis',
    ),
    'Noble\\School\\Events\\CreateParent' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateParentLis',
    ),
    'Noble\\School\\Events\\CreateStudent' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateStudentLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningBooking' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCleaningBookingLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningInvoice' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCleaningInvoiceLis',
    ),
    'Noble\\CleaningManagement\\Events\\CreateCleaningTeam' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCleaningTeamLis',
    ),
    'Noble\\MachineRepairManagement\\Events\\CreateMachine' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateMachineLis',
    ),
    'Noble\\MachineRepairManagement\\Events\\CreateMachineRepairRequest' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateMachineRepairRequestLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalAppointment' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHospitalAppointmentLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalDoctor' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHospitalDoctorLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalMedicine' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHospitalMedicineLis',
    ),
    'Noble\\HospitalManagement\\Events\\CreateHospitalPatient' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHospitalPatientLis',
    ),
    'Noble\\Timesheet\\Events\\CreateTimesheet' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateTimesheetLis',
    ),
    'Noble\\Notes\\Events\\CreateNote' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateNoteLis',
    ),
    'Noble\\Internalknowledge\\Events\\CreateInternalknowledgeArticle' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateInternalknowledgeArticleLis',
    ),
    'Noble\\Internalknowledge\\Events\\CreateInternalknowledgeBook' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateInternalknowledgeBookLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateCategory' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCategoryLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateChallenge' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateChallengeLis',
    ),
    'Noble\\InnovationCenter\\Events\\CreateCreativity' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCreativityLis',
    ),
    'Noble\\ToDo\\Events\\CompleteToDo' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CompleteToDoLis',
    ),
    'Noble\\ToDo\\Events\\CreateToDo' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateToDoLis',
    ),
    'Noble\\Documents\\Events\\CreateDocument' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateDocumentsLis',
    ),
    'Noble\\Documents\\Events\\StatusChangeDocument' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\StatusChangeDocumentLis',
    ),
    'Noble\\Account\\Events\\CreateCustomer' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateCustomerLis',
    ),
    'Noble\\Account\\Events\\CreateRevenue' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateRevenueLis',
    ),
    'Noble\\Account\\Events\\CreateVendor' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateVendorLis',
    ),
    'Noble\\Hrm\\Events\\CreateAnnouncement' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateAnnouncementLis',
    ),
    'Noble\\Hrm\\Events\\CreateAward' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateAwardLis',
    ),
    'Noble\\Hrm\\Events\\CreateEvent' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateEventLis',
    ),
    'Noble\\Hrm\\Events\\CreateHoliday' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreateHolidayLis',
    ),
    'Noble\\Hrm\\Events\\CreatePayroll' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\CreatePayrollLis',
    ),
    'Noble\\Hrm\\Events\\UpdateLeaveStatus' => 
    array (
      0 => 'Noble\\Twilio\\Listeners\\UpdateLeaveStatusLis',
    ),
  ),
  'Noble\\ZoomMeeting\\Providers\\EventServiceProvider' => 
  array (
    'App\\Events\\GivePermissionToRole' => 
    array (
      0 => 'Noble\\ZoomMeeting\\Listeners\\GiveRoleToPermission',
    ),
  ),
  'Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider' => 
  array (
    'Illuminate\\Auth\\Events\\Login' => 
    array (
      0 => 'App\\Listeners\\GamificationEventSubscriber@handleUserLogin',
    ),
  ),
);