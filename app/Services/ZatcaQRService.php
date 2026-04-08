<?php

namespace App\Services;

use Salla\ZATCA\GenerateQrCode;
use Salla\ZATCA\Tags\InvoiceDate;
use Salla\ZATCA\Tags\InvoiceTaxAmount;
use Salla\ZATCA\Tags\InvoiceTotalAmount;
use Salla\ZATCA\Tags\Seller;
use Salla\ZATCA\Tags\TaxNumber;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;

class ZatcaQRService
{
    /**
     * Generates a Phase 1 ZATCA-compliant QR Code representing the TLV Encoded Base64 String
     *
     * @param string $sellerName The merchant name
     * @param string $taxNumber The merchant VAT Number
     * @param string $invoiceDate ISO 8601 Timestamp of invoice creation
     * @param float|string $totalAmount Invoice total including VAT
     * @param float|string $taxAmount VAT total amount
     * @param bool $asDataUri If true, returns data:image/png;base64,... else just the base64 TLV string
     * @return string
     */
    public static function generate(
        $sellerName,
        $taxNumber,
        $invoiceDate,
        $totalAmount,
        $taxAmount,
        $asDataUri = true
    ) {
        try {
            $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($invoiceDate));

            $generator = GenerateQrCode::fromArray([
                new Seller($sellerName ?: 'DionCreative'),
                new TaxNumber($taxNumber ?: '310122393500003'),
                new InvoiceDate($formattedDate),
                new InvoiceTotalAmount((string) number_format((float)$totalAmount, 2, '.', '')),
                new InvoiceTaxAmount((string) number_format((float)$taxAmount, 2, '.', ''))
            ]);

            return $asDataUri ? $generator->render() : $generator->toBase64();
        } catch (\Exception $e) {
            Log::error('ZATCA QR Generation Failed: ' . $e->getMessage());
            return '';
        }
    }
}
