<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Noble\Rental\Models\RentalContract;
use Illuminate\Support\Facades\Auth;

class RentalContractPdfController extends Controller
{
    public function download($id)
    {
        $contract = RentalContract::with(['customer', 'items.product', 'project'])->findOrFail($id);
        
        // Security check: Only owners or the client themselves can download
        if (creatorId() != $contract->created_by && Auth::user()->id != $contract->customer_id) {
            return abort(403, 'Unauthorized access to this contract.');
        }

        $data = [
            'contract' => $contract,
        ];

        $pdf = Pdf::loadView('rental.contract_pdf', $data);
        
        return $pdf->download('Rental_Contract_' . $contract->contract_number . '.pdf');
    }

    public function stream($id)
    {
        $contract = RentalContract::with(['customer', 'items.product', 'project'])->findOrFail($id);
        
        if (creatorId() != $contract->created_by && Auth::user()->id != $contract->customer_id) {
            return abort(403, 'Unauthorized access to this contract.');
        }

        $data = [
            'contract' => $contract,
        ];

        $pdf = Pdf::loadView('rental.contract_pdf', $data);
        
        return $pdf->stream('Rental_Contract_' . $contract->contract_number . '.pdf');
    }
}
