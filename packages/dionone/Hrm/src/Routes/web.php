<?php

use DionONE\Hrm\Http\Controllers\IpRestrictController;

use DionONE\Hrm\Http\Controllers\PayrollController;

use DionONE\Hrm\Http\Controllers\LoanTypeController;

use DionONE\Hrm\Http\Controllers\DeductionTypeController;

use DionONE\Hrm\Http\Controllers\AllowanceTypeController;

use DionONE\Hrm\Http\Controllers\AllowanceController;

use DionONE\Hrm\Http\Controllers\DeductionController;

use DionONE\Hrm\Http\Controllers\LoanController;

use DionONE\Hrm\Http\Controllers\AttendanceController;

use DionONE\Hrm\Http\Controllers\ShiftController;

use DionONE\Hrm\Http\Controllers\LeaveApplicationController;

use DionONE\Hrm\Http\Controllers\LeaveTypeController;

use DionONE\Hrm\Http\Controllers\EventController;

use DionONE\Hrm\Http\Controllers\EventTypeController;

use DionONE\Hrm\Http\Controllers\AnnouncementController;

use DionONE\Hrm\Http\Controllers\AnnouncementCategoryController;

use DionONE\Hrm\Http\Controllers\AcknowledgmentController;

use DionONE\Hrm\Http\Controllers\DocumentController;

use DionONE\Hrm\Http\Controllers\DocumentCategoryController;

use DionONE\Hrm\Http\Controllers\HolidayController;

use DionONE\Hrm\Http\Controllers\HolidayTypeController;

use DionONE\Hrm\Http\Controllers\EmployeeTransferController;

use DionONE\Hrm\Http\Controllers\ComplaintTypeController;

use DionONE\Hrm\Http\Controllers\WarningController;

use DionONE\Hrm\Http\Controllers\WarningTypeController;

use DionONE\Hrm\Http\Controllers\ViolationTypeController;

use DionONE\Hrm\Http\Controllers\OnboardingController;
use DionONE\Hrm\Http\Controllers\CompanyAssetController;
use DionONE\Hrm\Http\Controllers\VacationSettlementController;
use DionONE\Hrm\Http\Controllers\FinalSettlementController;
use DionONE\Hrm\Http\Controllers\ComplaintController;

use DionONE\Hrm\Http\Controllers\TerminationController;

use DionONE\Hrm\Http\Controllers\TerminationTypeController;

use DionONE\Hrm\Http\Controllers\ResignationController;

use DionONE\Hrm\Http\Controllers\PromotionController;

use DionONE\Hrm\Http\Controllers\AwardController;

use DionONE\Hrm\Http\Controllers\AwardTypeController;

use DionONE\Hrm\Http\Controllers\EmployeeController;

use DionONE\Hrm\Http\Controllers\EmployeeDocumentTypeController;

use DionONE\Hrm\Http\Controllers\DesignationController;

use DionONE\Hrm\Http\Controllers\DepartmentController;
use Illuminate\Support\Facades\Route;
use DionONE\Hrm\Http\Controllers\DashboardController;
use DionONE\Hrm\Http\Controllers\BranchController;
use DionONE\Hrm\Http\Controllers\HrmDocumentController;
use DionONE\Hrm\Http\Controllers\WorkingDaysController;

Route::middleware(['web', 'auth', 'verified', 'PlanModuleCheck:Hrm'])->group(function () {
    Route::get('/hrm', [DashboardController::class, 'index'])->name('hrm.index');
    Route::get('/hrm/org-chart', [\DionONE\Hrm\Http\Controllers\OrgChartController::class, 'index'])->name('hrm.org-chart');
    
    // Biometric Logs
    Route::get('/hrm/biometric-logs', [\DionONE\Hrm\Http\Controllers\BiometricLogController::class, 'index'])->name('hrm.biometric-logs.index');
    Route::post('/hrm/biometric-logs/process', [\DionONE\Hrm\Http\Controllers\BiometricLogController::class, 'process'])->name('hrm.biometric-logs.process');

    Route::prefix('hrm/branches')->name('hrm.branches.')->group(function () {
        Route::get('/', [BranchController::class, 'index'])->name('index');
        Route::post('/', [BranchController::class, 'store'])->name('store');
        Route::get('/{branch}/edit', [BranchController::class, 'edit'])->name('edit');
        Route::put('/{branch}', [BranchController::class, 'update'])->name('update');
        Route::delete('/{branch}', [BranchController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/departments')->name('hrm.departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');
        Route::get('/{department}/edit', [DepartmentController::class, 'edit'])->name('edit');
        Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/designations')->name('hrm.designations.')->group(function () {
        Route::get('/', [DesignationController::class, 'index'])->name('index');
        Route::post('/', [DesignationController::class, 'store'])->name('store');
        Route::get('/{designation}/edit', [DesignationController::class, 'edit'])->name('edit');
        Route::put('/{designation}', [DesignationController::class, 'update'])->name('update');
        Route::delete('/{designation}', [DesignationController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/employee-document-types')->name('hrm.employee-document-types.')->group(function () {
        Route::get('/', [EmployeeDocumentTypeController::class, 'index'])->name('index');
        Route::post('/', [EmployeeDocumentTypeController::class, 'store'])->name('store');
        Route::get('/{employeedocumenttype}/edit', [EmployeeDocumentTypeController::class, 'edit'])->name('edit');
        Route::put('/{employeedocumenttype}', [EmployeeDocumentTypeController::class, 'update'])->name('update');
        Route::delete('/{employeedocumenttype}', [EmployeeDocumentTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/employees')->name('hrm.employees.')->group(function () {
        Route::get('/expiries', [EmployeeController::class, 'expiries'])->name('expiries');
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('create');
        Route::post('/', [EmployeeController::class, 'store'])->name('store');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->name('edit');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
        Route::get('/{employee}', [EmployeeController::class, 'show'])->name('show');
    });

    Route::delete('hrm/employees/attachments/{attachment}', [EmployeeController::class, 'destroyAttachment'])->name('hrm.employees.attachments.destroy');

    // Delete employee document
    Route::delete('hrm/employees/{employeeId}/documents/{document}', [EmployeeController::class, 'deleteDocument'])->name('hrm.employee-documents.destroy');

    Route::prefix('hrm/award-types')->name('hrm.award-types.')->group(function () {
        Route::get('/', [AwardTypeController::class, 'index'])->name('index');
        Route::post('/', [AwardTypeController::class, 'store'])->name('store');
        Route::get('/{awardtype}/edit', [AwardTypeController::class, 'edit'])->name('edit');
        Route::put('/{awardtype}', [AwardTypeController::class, 'update'])->name('update');
        Route::delete('/{awardtype}', [AwardTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/awards')->name('hrm.awards.')->group(function () {
        //Awards
        Route::patch('/{award}/status', [AwardController::class, 'updateStatus'])->name('updateStatus');
        Route::get('/', [AwardController::class, 'index'])->name('index');
        Route::post('/', [AwardController::class, 'store'])->name('store');
        Route::get('/{award}/edit', [AwardController::class, 'edit'])->name('edit');
        Route::put('/{award}', [AwardController::class, 'update'])->name('update');
        Route::delete('/{award}', [AwardController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/promotions')->name('hrm.promotions.')->group(function () {
        Route::get('/', [PromotionController::class, 'index'])->name('index');
        Route::post('/', [PromotionController::class, 'store'])->name('store');
        Route::get('/{promotion}/edit', [PromotionController::class, 'edit'])->name('edit');
        Route::put('/{promotion}', [PromotionController::class, 'update'])->name('update');
        Route::put('/{promotion}/status', [PromotionController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{promotion}', [PromotionController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/resignations')->name('hrm.resignations.')->group(function () {
        Route::get('/', [ResignationController::class, 'index'])->name('index');
        Route::post('/', [ResignationController::class, 'store'])->name('store');
        Route::get('/{resignation}/edit', [ResignationController::class, 'edit'])->name('edit');
        Route::put('/{resignation}', [ResignationController::class, 'update'])->name('update');
        Route::delete('/{resignation}', [ResignationController::class, 'destroy'])->name('destroy');
        Route::put('/{resignation}/status', [ResignationController::class, 'updateStatus'])->name('update-status');
    });

    Route::prefix('hrm/termination-types')->name('hrm.termination-types.')->group(function () {
        Route::get('/', [TerminationTypeController::class, 'index'])->name('index');
        Route::post('/', [TerminationTypeController::class, 'store'])->name('store');
        Route::get('/{terminationtype}/edit', [TerminationTypeController::class, 'edit'])->name('edit');
        Route::put('/{terminationtype}', [TerminationTypeController::class, 'update'])->name('update');
        Route::delete('/{terminationtype}', [TerminationTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/terminations')->name('hrm.terminations.')->group(function () {
        Route::get('/', [TerminationController::class, 'index'])->name('index');
        Route::post('/', [TerminationController::class, 'store'])->name('store');
        Route::get('/{termination}/edit', [TerminationController::class, 'edit'])->name('edit');
        Route::put('/{termination}', [TerminationController::class, 'update'])->name('update');
        Route::put('/{termination}/status', [TerminationController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{termination}', [TerminationController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/warning-types')->name('hrm.warning-types.')->group(function () {
        Route::get('/', [WarningTypeController::class, 'index'])->name('index');
        Route::post('/', [WarningTypeController::class, 'store'])->name('store');
        Route::get('/{warningtype}/edit', [WarningTypeController::class, 'edit'])->name('edit');
        Route::put('/{warningtype}', [WarningTypeController::class, 'update'])->name('update');
        Route::delete('/{warningtype}', [WarningTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/violation-types')->name('hrm.violation-types.')->group(function () {
        Route::get('/', [ViolationTypeController::class, 'index'])->name('index');
        Route::post('/', [ViolationTypeController::class, 'store'])->name('store');
        Route::put('/{violationType}', [ViolationTypeController::class, 'update'])->name('update');
        Route::delete('/{violationType}', [ViolationTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/warnings')->name('hrm.warnings.')->group(function () {
        Route::get('/', [WarningController::class, 'index'])->name('index');
        Route::post('/', [WarningController::class, 'store'])->name('store');
        Route::get('/{warning}/edit', [WarningController::class, 'edit'])->name('edit');
        Route::put('/{warning}', [WarningController::class, 'update'])->name('update');
        Route::delete('/{warning}', [WarningController::class, 'destroy'])->name('destroy');
        Route::put('/{warning}/response', [WarningController::class, 'response'])->name('response');
    });

    Route::prefix('hrm/violations')->name('hrm.violations.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\ViolationController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\ViolationController::class, 'store'])->name('store');
        Route::put('/{violation}', [\DionONE\Hrm\Http\Controllers\ViolationController::class, 'update'])->name('update');
        Route::delete('/{violation}', [\DionONE\Hrm\Http\Controllers\ViolationController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/onboarding')->name('hrm.onboarding.')->group(function () {
        Route::get('/', [OnboardingController::class, 'index'])->name('index');
        Route::post('/', [OnboardingController::class, 'store'])->name('store');
        Route::put('/{onboarding}', [OnboardingController::class, 'update'])->name('update');
        Route::delete('/{onboarding}', [OnboardingController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/assets')->name('hrm.assets.')->group(function () {
        Route::get('/', [CompanyAssetController::class, 'index'])->name('index');
        Route::post('/', [CompanyAssetController::class, 'store'])->name('store');
        Route::put('/{asset}', [CompanyAssetController::class, 'update'])->name('update');
        Route::delete('/{asset}', [CompanyAssetController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/employee-contracts')->name('hrm.employee-contracts.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\EmployeeContractController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\EmployeeContractController::class, 'store'])->name('store');
        Route::put('/{contract}', [\DionONE\Hrm\Http\Controllers\EmployeeContractController::class, 'update'])->name('update');
        Route::delete('/{contract}', [\DionONE\Hrm\Http\Controllers\EmployeeContractController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/vacation-settlement')->name('hrm.vacation-settlement.')->group(function () {
        Route::get('/', [VacationSettlementController::class, 'index'])->name('index');
        Route::post('/', [VacationSettlementController::class, 'store'])->name('store');
        Route::put('/{vacationSettlement}', [VacationSettlementController::class, 'update'])->name('update');
        Route::delete('/{vacationSettlement}', [VacationSettlementController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/final-settlement')->name('hrm.final-settlement.')->group(function () {
        Route::get('/', [FinalSettlementController::class, 'index'])->name('index');
        Route::post('/', [FinalSettlementController::class, 'store'])->name('store');
        Route::put('/{finalSettlement}', [FinalSettlementController::class, 'update'])->name('update');
        Route::delete('/{finalSettlement}', [FinalSettlementController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/complaints')->name('hrm.complaints.')->group(function () {
        Route::get('/', [ComplaintController::class, 'index'])->name('index');
        Route::post('/', [ComplaintController::class, 'store'])->name('store');
        Route::get('/{complaint}/edit', [ComplaintController::class, 'edit'])->name('edit');
        Route::put('/{complaint}', [ComplaintController::class, 'update'])->name('update');
        Route::put('/{complaint}/status', [ComplaintController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{complaint}', [ComplaintController::class, 'destroy'])->name('destroy');
    });

    // Dependent dropdown routes
    Route::get('hrm/users/{employee}/warning-bies', [WarningController::class, 'getWarningBiesByEmployee'])->name('hrm.users.warning-bies');
    Route::get('hrm/users/{warningBy}/warning-types', [WarningController::class, 'getWarningTypesByWarningBy'])->name('hrm.users.warning-types');

    Route::prefix('hrm/complaint-types')->name('hrm.complaint-types.')->group(function () {
        Route::get('/', [ComplaintTypeController::class, 'index'])->name('index');
        Route::post('/', [ComplaintTypeController::class, 'store'])->name('store');
        Route::get('/{complainttype}/edit', [ComplaintTypeController::class, 'edit'])->name('edit');
        Route::put('/{complainttype}', [ComplaintTypeController::class, 'update'])->name('update');
        Route::delete('/{complainttype}', [ComplaintTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/employee-transfers')->name('hrm.employee-transfers.')->group(function () {
        Route::get('/', [EmployeeTransferController::class, 'index'])->name('index');
        Route::post('/', [EmployeeTransferController::class, 'store'])->name('store');
        Route::get('/{employeetransfer}/edit', [EmployeeTransferController::class, 'edit'])->name('edit');
        Route::put('/{employeetransfer}', [EmployeeTransferController::class, 'update'])->name('update');
        Route::put('/{employeetransfer}/status', [EmployeeTransferController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{employeetransfer}', [EmployeeTransferController::class, 'destroy'])->name('destroy');
        Route::get('/{employeetransfer}/show', [EmployeeTransferController::class, 'show'])->name('show');
    });



    Route::prefix('hrm/holiday-types')->name('hrm.holiday-types.')->group(function () {
        Route::get('/', [HolidayTypeController::class, 'index'])->name('index');
        Route::post('/', [HolidayTypeController::class, 'store'])->name('store');
        Route::get('/{holidaytype}/edit', [HolidayTypeController::class, 'edit'])->name('edit');
        Route::put('/{holidaytype}', [HolidayTypeController::class, 'update'])->name('update');
        Route::delete('/{holidaytype}', [HolidayTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/holidays')->name('hrm.holidays.')->group(function () {
        Route::get('/', [HolidayController::class, 'index'])->name('index');
        Route::post('/', [HolidayController::class, 'store'])->name('store');
        Route::get('/{holiday}/edit', [HolidayController::class, 'edit'])->name('edit');
        Route::put('/{holiday}', [HolidayController::class, 'update'])->name('update');
        Route::delete('/{holiday}', [HolidayController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/document-categories')->name('hrm.document-categories.')->group(function () {
        Route::get('/', [DocumentCategoryController::class, 'index'])->name('index');
        Route::post('/', [DocumentCategoryController::class, 'store'])->name('store');
        Route::get('/{documentcategory}/edit', [DocumentCategoryController::class, 'edit'])->name('edit');
        Route::put('/{documentcategory}', [DocumentCategoryController::class, 'update'])->name('update');
        Route::delete('/{documentcategory}', [DocumentCategoryController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/documents')->name('hrm.documents.')->group(function () {
        Route::get('/', [HrmDocumentController::class, 'index'])->name('index');
        Route::post('/', [HrmDocumentController::class, 'store'])->name('store');
        Route::get('/{document}/edit', [HrmDocumentController::class, 'edit'])->name('edit');
        Route::put('/{hrmDocument}', [HrmDocumentController::class, 'update'])->name('update');
        Route::put('/{hrmDocument}/status', [HrmDocumentController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{hrmDocument}', [HrmDocumentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/acknowledgments')->name('hrm.acknowledgments.')->group(function () {
        Route::get('/', [AcknowledgmentController::class, 'index'])->name('index');
        Route::post('/', [AcknowledgmentController::class, 'store'])->name('store');
        Route::get('/{acknowledgment}/edit', [AcknowledgmentController::class, 'edit'])->name('edit');
        Route::put('/{acknowledgment}', [AcknowledgmentController::class, 'update'])->name('update');
        Route::put('/{acknowledgment}/status', [AcknowledgmentController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{acknowledgment}', [AcknowledgmentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/announcement-categories')->name('hrm.announcement-categories.')->group(function () {
        Route::get('/', [AnnouncementCategoryController::class, 'index'])->name('index');
        Route::post('/', [AnnouncementCategoryController::class, 'store'])->name('store');
        Route::get('/{announcementcategory}/edit', [AnnouncementCategoryController::class, 'edit'])->name('edit');
        Route::put('/{announcementcategory}', [AnnouncementCategoryController::class, 'update'])->name('update');
        Route::delete('/{announcementcategory}', [AnnouncementCategoryController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/announcements')->name('hrm.announcements.')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index'])->name('index');
        Route::post('/', [AnnouncementController::class, 'store'])->name('store');
        Route::get('/{announcement}/edit', [AnnouncementController::class, 'edit'])->name('edit');
        Route::put('/{announcement}', [AnnouncementController::class, 'update'])->name('update');
        Route::put('/{announcement}/status', [AnnouncementController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{announcement}', [AnnouncementController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/event-types')->name('hrm.event-types.')->group(function () {
        Route::get('/', [EventTypeController::class, 'index'])->name('index');
        Route::post('/', [EventTypeController::class, 'store'])->name('store');
        Route::get('/{eventtype}/edit', [EventTypeController::class, 'edit'])->name('edit');
        Route::put('/{eventtype}', [EventTypeController::class, 'update'])->name('update');
        Route::delete('/{eventtype}', [EventTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/events')->name('hrm.events.')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('/event-calendar', [EventController::class, 'calendar'])->name('calendar');
        Route::post('/', [EventController::class, 'store'])->name('store');
        Route::get('/{event}/edit', [EventController::class, 'edit'])->name('edit');
        Route::put('/{event}', [EventController::class, 'update'])->name('update');
        Route::put('/{event}/status-update', [EventController::class, 'statusUpdate'])->name('status-update');
        Route::delete('/{event}', [EventController::class, 'destroy'])->name('destroy');
    });

    // Dependent dropdown routes
    Route::get('hrm/event-types/{eventType}/approved-bies', [EventController::class, 'getApprovedBiesByEventType'])->name('hrm.event-types.approved-bies');

    Route::prefix('hrm/leave-types')->name('hrm.leave-types.')->group(function () {
        Route::get('/', [LeaveTypeController::class, 'index'])->name('index');
        Route::post('/', [LeaveTypeController::class, 'store'])->name('store');
        Route::get('/{leavetype}/edit', [LeaveTypeController::class, 'edit'])->name('edit');
        Route::put('/{leavetype}', [LeaveTypeController::class, 'update'])->name('update');
        Route::delete('/{leavetype}', [LeaveTypeController::class, 'destroy'])->name('destroy');
    });

    // Leave Applications
    Route::prefix('hrm/leave-applications')->name('hrm.leave-applications.')->group(function () {
        Route::get('/timeline', [\DionONE\Hrm\Http\Controllers\LeaveApplicationController::class, 'timeline'])->name('timeline');
        Route::get('/', [LeaveApplicationController::class, 'index'])->name('index');
        Route::post('/', [LeaveApplicationController::class, 'store'])->name('store');
        Route::get('/{leaveapplication}/edit', [LeaveApplicationController::class, 'edit'])->name('edit');
        Route::put('/{leaveapplication}', [LeaveApplicationController::class, 'update'])->name('update');
        Route::put('/{leaveapplication}/status', [LeaveApplicationController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{leaveapplication}', [LeaveApplicationController::class, 'destroy'])->name('destroy');
    });

    Route::delete('hrm/leave-applications/attachments/{attachment}', [LeaveApplicationController::class, 'destroyAttachment'])->name('hrm.leave-applications.attachments.destroy');

    Route::prefix('hrm/leave-balance')->name('hrm.leave-balance.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\LeaveBalanceController::class, 'index'])->name('index');
    });

    // Dependent dropdown routes
    Route::get('hrm/users/{employee}/leave_types', [LeaveApplicationController::class, 'getLeaveTypesByEmployee'])->name('hrm.users.leave_types');
    Route::get('hrm/leave-balance/{employee}/{leaveType}', [LeaveApplicationController::class, 'getLeaveBalance'])->name('hrm.leave-balance');

    // Shifts
    Route::prefix('hrm/shifts')->name('hrm.shifts.')->group(function () {
        Route::get('/scheduler', [\DionONE\Hrm\Http\Controllers\ShiftController::class, 'scheduler'])->name('scheduler');
        Route::get('/', [ShiftController::class, 'index'])->name('index');
        Route::post('/', [ShiftController::class, 'store'])->name('store');
        Route::get('/{shift}/edit', [ShiftController::class, 'edit'])->name('edit');
        Route::put('/{shift}', [ShiftController::class, 'update'])->name('update');
        Route::delete('/{shift}', [ShiftController::class, 'destroy'])->name('destroy');
    });

    // Attendances
    Route::prefix('hrm/attendances')->name('hrm.attendances.')->group(function () {
        Route::get('/tracker', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'tracker'])->name('tracker');
        Route::get('/', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'store'])->name('store');
        Route::put('/{attendance}', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'update'])->name('update');
        Route::delete('/{attendance}', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'destroy'])->name('destroy');
        Route::post('/clock-in', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'clockIn'])->name('clock-in');
        Route::post('/clock-out', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'clockOut'])->name('clock-out');
        Route::get('/clock-status', [\DionONE\Hrm\Http\Controllers\AttendanceController::class, 'getClockStatus'])->name('clock-status');
    });

    Route::prefix('hrm/set-salary')->name('hrm.set-salary.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\SetSalaryController::class, 'index'])->name('index');
        Route::get('/{employee}', [\DionONE\Hrm\Http\Controllers\SetSalaryController::class, 'show'])->name('show');
        Route::put('/{employee}', [\DionONE\Hrm\Http\Controllers\SetSalaryController::class, 'update'])->name('update');
    });

    // Dependent dropdown routes
    Route::get('hrm/employees/{employee}/shifts', [AttendanceController::class, 'getShiftsByEmployee'])->name('hrm.employees.shifts');

    Route::prefix('hrm/allowance-types')->name('hrm.allowance-types.')->group(function () {
        Route::get('/', [AllowanceTypeController::class, 'index'])->name('index');
        Route::post('/', [AllowanceTypeController::class, 'store'])->name('store');
        Route::get('/{allowancetype}/edit', [AllowanceTypeController::class, 'edit'])->name('edit');
        Route::put('/{allowancetype}', [AllowanceTypeController::class, 'update'])->name('update');
        Route::delete('/{allowancetype}', [AllowanceTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/deduction-types')->name('hrm.deduction-types.')->group(function () {
        Route::get('/', [DeductionTypeController::class, 'index'])->name('index');
        Route::post('/', [DeductionTypeController::class, 'store'])->name('store');
        Route::get('/{deductiontype}/edit', [DeductionTypeController::class, 'edit'])->name('edit');
        Route::put('/{deductiontype}', [DeductionTypeController::class, 'update'])->name('update');
        Route::delete('/{deductiontype}', [DeductionTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/loan-types')->name('hrm.loan-types.')->group(function () {
        Route::get('/', [LoanTypeController::class, 'index'])->name('index');
        Route::post('/', [LoanTypeController::class, 'store'])->name('store');
        Route::get('/{loantype}/edit', [LoanTypeController::class, 'edit'])->name('edit');
        Route::put('/{loantype}', [LoanTypeController::class, 'update'])->name('update');
        Route::delete('/{loantype}', [LoanTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('hrm/working-days')->name('hrm.working-days.')->group(function () {
        Route::get('/', [WorkingDaysController::class, 'index'])->name('index');
        Route::put('/', [WorkingDaysController::class, 'update'])->name('update');
    });

    // Allowances routes
    Route::prefix('hrm/allowances')->name('hrm.allowances.')->group(function () {
        Route::post('/', [AllowanceController::class, 'store'])->name('store');
        Route::put('/{allowance}', [AllowanceController::class, 'update'])->name('update');
        Route::delete('/{allowance}', [AllowanceController::class, 'destroy'])->name('destroy');
    });

    // Deductions routes
    Route::prefix('hrm/deductions')->name('hrm.deductions.')->group(function () {
        Route::post('/', [DeductionController::class, 'store'])->name('store');
        Route::put('/{deduction}', [DeductionController::class, 'update'])->name('update');
        Route::delete('/{deduction}/{employee}', [DeductionController::class, 'destroy'])->name('destroy');
    });

    // Loans routes
    Route::prefix('hrm/loans')->name('hrm.loans.')->group(function () {
        Route::patch('/{loan}/status', [LoanController::class, 'updateStatus'])->name('updateStatus');
        Route::post('/', [LoanController::class, 'store'])->name('store');
        Route::put('/{loan}', [LoanController::class, 'update'])->name('update');
        Route::delete('/{loan}/{employee}', [LoanController::class, 'destroy'])->name('destroy');
    });

    // Overtimes routes
    Route::prefix('hrm/overtimes')->name('hrm.overtimes.')->group(function () {
        Route::post('/', [\DionONE\Hrm\Http\Controllers\OvertimeController::class, 'store'])->name('store');
        Route::put('/{overtime}', [\DionONE\Hrm\Http\Controllers\OvertimeController::class, 'update'])->name('update');
        Route::delete('/{overtime}/{employee}', [\DionONE\Hrm\Http\Controllers\OvertimeController::class, 'destroy'])->name('destroy');
    });



    Route::prefix('hrm/payrolls')->name('hrm.payrolls.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');
        Route::post('/', [PayrollController::class, 'store'])->name('store');
        Route::get('/{payroll}', [PayrollController::class, 'show'])->name('show');
        Route::get('/{payroll}/edit', [PayrollController::class, 'edit'])->name('edit');
        Route::put('/{payroll}', [PayrollController::class, 'update'])->name('update');
        Route::delete('/{payroll}', [PayrollController::class, 'destroy'])->name('destroy');
        Route::post('/{payroll}/run', [PayrollController::class, 'runPayroll'])->name('run');
    });

    Route::delete('/hrm/payroll-entries/{payrollEntry}', [PayrollController::class, 'destroyEntry'])->name('hrm.payroll-entries.destroy');
    Route::get('/hrm/payroll-entries/{payrollEntry}/print', [PayrollController::class, 'printPayslip'])->name('hrm.payroll-entries.print');
    Route::patch('/hrm/payroll-entries/{payrollEntry}/pay', [PayrollController::class, 'paySalary'])->name('hrm.payroll-entries.pay');

    Route::prefix('hrm/ip-restricts')->name('hrm.ip-restricts.')->group(function () {
        Route::get('/', [IpRestrictController::class, 'index'])->name('index');
        Route::post('/', [IpRestrictController::class, 'store'])->name('store');
        Route::put('/{iprestrict}', [IpRestrictController::class, 'update'])->name('update');
        Route::delete('/{iprestrict}', [IpRestrictController::class, 'destroy'])->name('destroy');
        Route::post('/toggle-setting', [IpRestrictController::class, 'toggleSetting'])->name('toggle-setting');
    });

    // Company Assets
    Route::prefix('hrm/assets')->name('hrm.assets.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\CompanyAssetController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\CompanyAssetController::class, 'store'])->name('store');
        Route::put('/{asset}', [\DionONE\Hrm\Http\Controllers\CompanyAssetController::class, 'update'])->name('update');
        Route::delete('/{asset}', [\DionONE\Hrm\Http\Controllers\CompanyAssetController::class, 'destroy'])->name('destroy');
    });

    // Employee Onboarding
    Route::prefix('hrm/onboarding')->name('hrm.onboarding.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\OnboardingController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\OnboardingController::class, 'store'])->name('store');
        Route::put('/{onboarding}', [\DionONE\Hrm\Http\Controllers\OnboardingController::class, 'update'])->name('update');
        Route::delete('/{onboarding}', [\DionONE\Hrm\Http\Controllers\OnboardingController::class, 'destroy'])->name('destroy');
    });

    // Vacation Settlement
    Route::prefix('hrm/vacation-settlement')->name('hrm.vacation-settlement.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\VacationSettlementController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\VacationSettlementController::class, 'store'])->name('store');
        Route::put('/{vacationSettlement}', [\DionONE\Hrm\Http\Controllers\VacationSettlementController::class, 'update'])->name('update');
        Route::delete('/{vacationSettlement}', [\DionONE\Hrm\Http\Controllers\VacationSettlementController::class, 'destroy'])->name('destroy');
    });

    // Final Settlement
    Route::prefix('hrm/final-settlement')->name('hrm.final-settlement.')->group(function () {
        Route::get('/', [\DionONE\Hrm\Http\Controllers\FinalSettlementController::class, 'index'])->name('index');
        Route::post('/', [\DionONE\Hrm\Http\Controllers\FinalSettlementController::class, 'store'])->name('store');
        Route::put('/{finalSettlement}', [\DionONE\Hrm\Http\Controllers\FinalSettlementController::class, 'update'])->name('update');
        Route::delete('/{finalSettlement}', [\DionONE\Hrm\Http\Controllers\FinalSettlementController::class, 'destroy'])->name('destroy');
    });
});
