<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use App\Models\SalesInvoice;
use App\Models\User;

class InvoicePdfController extends Controller
{
    /**
     * Download an invoice as a PDF legally formatted.
     */
    public function downloadPdf($id)
    {
        $invoice = SalesInvoice::with(['customer', 'items.product', 'items.project', 'items.rentalContract'])->findOrFail($id);
        $customer = $invoice->customer;

        // Group items by project
        $groupedItems = $invoice->items->groupBy(function($item) {
            return $item->project ? $item->project->name : 'General';
        });

        $data = [
            'invoice' => $invoice,
            'customer' => $customer,
            'groupedItems' => $groupedItems,
            'company_name' => 'Sukoun Albunyan Scaffolding & Trading',
            'company_address' => 'Industrial Area, Dubai, UAE',
            'company_email' => 'billing@sukounalbunyan.ae'
        ];

        // Generate PDF
        $pdf = Pdf::loadView('invoices.premium_template', $data);
        
        // Return for direct download
        return $pdf->download($invoice->invoice_number . '.pdf');
    }
    
    /**
     * View an invoice as a PDF directly in the browser.
     */
    public function streamPdf($id)
    {
        $invoice = SalesInvoice::with(['customer', 'items.product', 'items.project', 'items.rentalContract'])->findOrFail($id);
        $customer = $invoice->customer;

        // Group items by project
        $groupedItems = $invoice->items->groupBy(function($item) {
            return $item->project ? $item->project->name : 'General';
        });

        $data = [
            'invoice' => $invoice,
            'customer' => $customer,
            'groupedItems' => $groupedItems,
            'company_name' => 'Sukoun Albunyan Scaffolding & Trading',
            'company_address' => 'Industrial Area, Dubai, UAE',
            'company_email' => 'billing@sukounalbunyan.ae'
        ];

        $pdf = Pdf::loadView('invoices.premium_template', $data);
        return $pdf->stream($invoice->invoice_number . '.pdf');
    }
}

