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
        // For development/demonstration, we fetch the first User as customer if SalesInvoice is empty
        // In actual production, replace with `$invoice = SalesInvoice::findOrFail($id);`
        $invoice = new \stdClass();
        $invoice->invoice_id = 'INV-' . str_pad($id, 6, "0", STR_PAD_LEFT);
        $invoice->issue_date = date('Y-m-d');
        $invoice->due_date = date('Y-m-d', strtotime('+7 days'));
        $invoice->status = 'PAID';
        $invoice->sub_total = 1599.00;
        $invoice->tax_amount = 159.90;
        $invoice->discount_amount = 0;
        $invoice->total_amount = 1758.90;

        $customer = User::where('type', '!=', 'superadmin')->first() ?? new \stdClass();
        $customer->name = $customer->name ?? 'John Doe LLC';
        $customer->billing_address = '123 Tech Boulevard';
        $customer->billing_city = 'Damascus';
        $customer->billing_zip = '10011';
        $customer->email = $customer->email ?? 'contact@johndoe.com';

        $data = [
            'invoice' => $invoice,
            'customer' => $customer,
            'company_name' => 'DionONE SaaS Platform',
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
        $invoice = new \stdClass();
        $invoice->invoice_id = 'INV-' . str_pad($id, 6, "0", STR_PAD_LEFT);
        $invoice->issue_date = date('Y-m-d');
        $invoice->due_date = date('Y-m-d', strtotime('+30 days'));
        $invoice->status = 'PARTIAL';
        
        $customer = User::first() ?? new \stdClass();
        $customer->name = $customer->name ?? 'Generic Company';

        $data = [
            'invoice' => $invoice,
            'customer' => $customer
        ];

        $pdf = Pdf::loadView('invoices.premium_template', $data);
        return $pdf->stream($invoice->invoice_id . '.pdf');
    }
}
