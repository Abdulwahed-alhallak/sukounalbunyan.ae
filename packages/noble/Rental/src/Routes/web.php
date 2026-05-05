<?php

use Illuminate\Support\Facades\Route;
use Noble\Rental\Http\Controllers\RentalController;
use Noble\Rental\Http\Controllers\RentalDashboardController;
use Noble\Rental\Http\Controllers\RentalReturnController;
use Noble\Rental\Http\Controllers\RentalProjectController;
use Noble\Rental\Http\Controllers\RentalQuotationController;

Route::middleware(['web', 'auth', 'can:manage-rentals'])->group(function () {
    Route::get('rental-dashboard', [RentalDashboardController::class, 'index'])->name('rental.dashboard');

    // ── Rental Projects ────────────────────────────────────────────────────
    Route::resource('rental-projects', RentalProjectController::class);

    // ── Rental Returns ─────────────────────────────────────────────────────
    Route::get('rental-returns/create', [RentalReturnController::class, 'create'])->name('rental-returns.create');
    Route::get('rental-returns/contract/{id}/items', [RentalReturnController::class, 'getContractItems'])->name('rental-returns.items');
    Route::post('rental-returns', [RentalReturnController::class, 'store'])->name('rental-returns.store');

    // ── Rental Contracts (resource) ────────────────────────────────────────
    Route::resource('rental', RentalController::class);

    // Contract Actions
    Route::post('rental/{contract}/return',       [RentalController::class, 'returnItems'])->name('rental.return');
    Route::post('rental/{contract}/return-all',   [RentalController::class, 'returnAllItems'])->name('rental.returnAll');
    Route::post('rental/{contract}/invoice',      [RentalController::class, 'convertToInvoice'])->name('rental.invoice');
    Route::post('rental/{rental}/installment/{installment}/invoice', [RentalController::class, 'invoiceInstallment'])->name('rental.installment.invoice');
    Route::post('rental/{contract}/renew',        [RentalController::class, 'renew'])->name('rental.renew');
    Route::post('rental/{contract}/activate',     [RentalController::class, 'activate'])->name('rental.activate');
    Route::post('rental/{contract}/settle-deposit',[RentalController::class, 'settleDeposit'])->name('rental.settle-deposit');
    Route::post('rental/{contract}/payment',      [RentalController::class, 'recordPayment'])->name('rental.payment');
    Route::post('rental/{contract}/close',        [RentalController::class, 'close'])->name('rental.close');

    // ── New Business Scenario Routes ───────────────────────────────────────
    Route::post('rental/{contract}/add-materials',[RentalController::class, 'addMaterials'])->name('rental.add-materials');
    Route::post('rental/{contract}/lease-to-own', [RentalController::class, 'leaseToOwn'])->name('rental.lease-to-own');

    // PDF & Print
    Route::get('rental/return/{rentalReturn}/pdf', [RentalController::class, 'downloadReturnPdf'])->name('rental.return.pdf');
    Route::get('rental/{contract}/pdf',            [RentalController::class, 'downloadPdf'])->name('rental.pdf');
    Route::get('rental/{contract}/labels',         [RentalController::class, 'printLabels'])->name('rental.labels');
    Route::get('rental/{contract}/logistics-pdf',  [RentalController::class, 'downloadLogisticsPdf'])->name('rental.logistics.pdf');

    // ── Reports ────────────────────────────────────────────────────────────
    Route::get('/reports/rental',                    [\Noble\Rental\Http\Controllers\RentalReportController::class, 'index'])->name('rental.reports.index');
    Route::get('/reports/rental/custody/{product}',  [\Noble\Rental\Http\Controllers\RentalReportController::class, 'custodyByProduct'])->name('rental.reports.custody');

    // ── Quotation → Rental Conversion ──────────────────────────────────────
    Route::post('rental/from-quotation/{quotation}',          [RentalController::class, 'createFromQuotation'])->name('rental.from-quotation');
    Route::post('quotation/{quotation}/convert-to-rental',    [RentalQuotationController::class, 'convertToRentalContract'])->name('quotation.convert-to-rental');

    // Misc
    Route::delete('rental/attachment/{attachment}',   [RentalController::class, 'destroyAttachment'])->name('rental.attachment.destroy');
    Route::get('rental/scan-qr/{contract}/{product?}',[RentalController::class, 'scanQr'])->name('rental.scan-qr');
    Route::post('rental/scan-qr-process',             [RentalController::class, 'processScan'])->name('rental.scan-qr-process');
});

