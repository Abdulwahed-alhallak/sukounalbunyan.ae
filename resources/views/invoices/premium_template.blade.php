<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_id ?? '#INV-0000' }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 20px;
            color: #27272a; 
            font-size: 14px;
        }
        .header {
            width: 100%;
            border-bottom: 3px solid #f59e0b; /* dion-amber */
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header td {
            vertical-align: top;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #09090b; /* dion-bg */
            letter-spacing: 1px;
        }
        .logo span {
            color: #22d3ee; /* dion-cyan */
        }
        .invoice-details {
            text-align: right;
            font-size: 14px;
        }
        .invoice-title {
            font-size: 32px;
            color: #18181b;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .address-box {
            width: 100%;
            margin-bottom: 30px;
        }
        .address-box td {
            width: 50%;
            vertical-align: top;
        }
        .box-title {
            font-weight: bold;
            color: #71717a;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .table-items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .table-items th {
            background-color: #09090b;
            color: #ffffff;
            padding: 12px;
            text-align: left;
            font-size: 13px;
            text-transform: uppercase;
        }
        .table-items td {
            padding: 12px;
            border-bottom: 1px solid #e4e4e7;
        }
        .table-items tr:last-child td {
            border-bottom: 2px solid #09090b;
        }
        .totals-box {
            width: 50%;
            float: right;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .totals-box td {
            padding: 8px 12px;
        }
        .totals-row td {
            border-bottom: 1px solid #e4e4e7;
        }
        .grand-total {
            font-weight: bold;
            font-size: 18px;
            background-color: #f4f4f5;
        }
        .footer {
            position: fixed;
            bottom: 0px;
            left: 0px;
            right: 0px;
            height: 50px;
            text-align: center;
            font-size: 12px;
            color: #71717a;
            border-top: 1px solid #e4e4e7;
            padding-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
        }
        .status-paid {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-unpaid {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .status-partial {
            background-color: #fef9c3;
            color: #854d0e;
        }
    </style>
</head>
<body>

    <table class="header">
        <tr>
            <td style="width: 50%;">
                <!-- Dion Creative Logo standard text, or embedded image -->
                <div class="logo">DION<span>ONE</span></div>
                <div style="margin-top: 10px; color: #71717a;">
                    {{ $company_name ?? 'Dion Creative Agency' }}<br>
                    {{ $company_address ?? 'Damascus, Syria' }}<br>
                    {{ $company_email ?? 'billing@dion.sy' }}
                </div>
            </td>
            <td class="invoice-details">
                <h1 class="invoice-title">INVOICE</h1>
                <strong># {{ $invoice->invoice_id ?? $invoice->invoice_number ?? 'INV-0000000' }}</strong><br><br>
                Date: {{ $invoice->invoice_date ?? $invoice->issue_date ?? date('Y-m-d') }}<br>
                Due Date: {{ $invoice->due_date ?? date('Y-m-d') }}<br>
                <br>
                <div class="status-badge status-{{ strtolower($invoice->status ?? 'unpaid') }}">
                    {{ strtoupper($invoice->status ?? 'UNPAID') }}
                </div>
                
                @if(isset($invoice->zatca_qr) && !empty($invoice->zatca_qr))
                    <div style="margin-top: 20px;">
                        <img src="{{ $invoice->zatca_qr }}" style="width: 100px; height: 100px;" alt="ZATCA QR Code">
                    </div>
                @endif
            </td>
        </tr>
    </table>

    <table class="address-box">
        <tr>
            <td>
                <div class="box-title">Billed To:</div>
                <strong>{{ $customer->name ?? 'Client Name' }}</strong><br>
                {{ $customer->billing_address ?? 'N/A' }}<br>
                {{ $customer->billing_city ?? '' }} {{ $customer->billing_zip ?? '' }}<br>
                {{ $customer->email ?? 'N/A' }}
            </td>
            <td>
                <div class="box-title">Payment Terms:</div>
                Please pay the total amount within the due date.<br>
                Bank Transfer preferred.
            </td>
        </tr>
    </table>

    <table class="table-items">
        <thead>
            <tr>
                <th style="width: 40%">Item / Description</th>
                <th style="width: 15%">Qty</th>
                <th style="width: 20%">Price</th>
                <th style="width: 25%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($items) && count($items) > 0)
                @foreach($items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->name }}</strong><br>
                        <span style="font-size: 11px; color: #71717a;">{{ $item->description }}</span>
                    </td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ number_format($item->price, 2) }}</td>
                    <td style="text-align: right;">{{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
                @endforeach
            @else
                <tr>
                    <td>Premium Web Development Services</td>
                    <td>1</td>
                    <td>$ 1,500.00</td>
                    <td style="text-align: right;">$ 1,500.00</td>
                </tr>
                <tr>
                    <td>SaaS Monthly Subscription</td>
                    <td>1</td>
                    <td>$ 99.00</td>
                    <td style="text-align: right;">$ 99.00</td>
                </tr>
            @endif
        </tbody>
    </table>

    <div style="clear: both; overflow: auto;">
        <table class="totals-box">
            <tr class="totals-row">
                <td style="text-align: right; color: #71717a;">Subtotal</td>
                <td style="text-align: right;">$ {{ number_format($invoice->sub_total ?? 1599.00, 2) }}</td>
            </tr>
            <tr class="totals-row">
                <td style="text-align: right; color: #71717a;">Tax (VAT)</td>
                <td style="text-align: right;">$ {{ number_format($invoice->tax_amount ?? 159.90, 2) }}</td>
            </tr>
            @if(isset($invoice->discount_amount) && $invoice->discount_amount > 0)
            <tr class="totals-row">
                <td style="text-align: right; color: #71717a;">Discount</td>
                <td style="text-align: right;">- $ {{ number_format($invoice->discount_amount, 2) }}</td>
            </tr>
            @endif
            <tr>
                <td class="grand-total" style="text-align: right;">Grand Total</td>
                <td class="grand-total" style="text-align: right;">$ {{ number_format($invoice->total_amount ?? 1758.90, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <strong>Digitally Generated & Verified viaNobleArchitecture Enterprise SaaS</strong><br>
        This is a computer generated document. No signature is required.
    </div>

</body>
</html>


