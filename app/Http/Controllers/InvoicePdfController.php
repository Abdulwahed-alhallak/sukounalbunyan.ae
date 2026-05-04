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
        $invoice = SalesInvoice::with(['customer', 'items'])->findOrFail($id);
        $customer = $invoice->customer;

        $data = [
            'invoice' => $invoice,
            'customer' => $customer,
            'items' => $invoice->items,
            'company_name' => 'Sukoun Albunyan SaaS Platform',
            'company_address' => 'Floor 15, Enterprise Tower, Damascus, Syria',
            'company_email' => 'billing@dion.sy'
        ];

        // Generate PDF
        $pdf = Pdf::loadView('invoices.premium_template', $data);
        
        // Return for direct download
        return $pdf->download($invoice->invoice_id . '.pdf');
    }
    
    /**
     * View an invoice as a PDF directly in the browser.
     */
    public function streamPdf($id)
    {
        $invoice = SalesInvoice::with(['customer', 'items'])->findOrFail($id);
        $customer = $invoice->customer;

        $data = [
            'invoice' => $invoice,
            'customer' => $customer,
            'items' => $invoice->items,
        ];

        $pdf = Pdf::loadView('invoices.premium_template', $data);
        return $pdf->stream($invoice->invoice_id . '.pdf');
    }
}

