<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <title>Return Receipt - {{ $rentalReturn->id }}</title>
    <style>
        @page { margin: 0px; }
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            font-size: 11px; 
            color: #333; 
            line-height: 1.5; 
            margin: 0; 
            padding: 0;
            text-align: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }};
        }
        .bg-orange { background-color: #f97316; color: white; }
        .text-orange { color: #f97316; }
        .header { padding: 40px; }
        .header table { width: 100%; border: none; }
        .brand-section { vertical-align: middle; text-align: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }}; }
        .brand-section h1 { margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
        .receipt-label { text-align: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'left' : 'right' }}; vertical-align: middle; }
        .receipt-label h2 { margin: 0; font-size: 18px; color: #ffffff; }
        
        .content { padding: 0 40px; }
        .info-grid { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
        .info-col { 
            width: 48%; 
            vertical-align: top; 
            background: #fff7ed; 
            padding: 15px; 
            border-radius: 8px; 
        }
        .spacer-col { width: 4%; }
        
        .section-title { 
            font-size: 12px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            color: #64748b;
            text-align: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }};
        }
        
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 8px; overflow: hidden; }
        .items-table th { 
            background: #ea580c; 
            color: white; 
            padding: 12px; 
            text-align: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }}; 
            font-size: 10px; 
            text-transform: uppercase; 
        }
        .items-table td { padding: 12px; border-bottom: 1px solid #fed7aa; }
        
        .damage-box { margin-top: 30px; padding: 20px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; color: #991b1b; }
        
        .signature-section { margin-top: 50px; padding: 40px; }
        .sig-line { 
            width: 45%; 
            border-top: 1px solid #94a3b8; 
            text-align: center; 
            padding-top: 10px; 
        }
        .sig-spacer { width: 10%; height: 10px; }
        
        .footer { position: fixed; bottom: 0; width: 100%; padding: 20px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        .clearfix { clear: both; }
    </style>
</head>
<body>
    <div class="bg-orange header">
        <table>
            <tr>
                <td class="brand-section">
                    <h1>SUKOUN <span style="opacity: 0.8;">RENTAL</span></h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">WAREHOUSE RETURN RECEIPT</p>
                </td>
                <td class="receipt-label">
                    <h2>{{ __('RETURN RECEIPT') }}</h2>
                    <p style="margin: 5px 0 0 0;">#RET-{{ $rentalReturn->id }}</p>
                    <p style="margin: 0; font-size: 10px;">{{ __('Date') }}: {{ $rentalReturn->return_date->format('Y-m-d') }}</p>
                </td>
            </tr>
        </table>
    </div>

    <div class="content" style="margin-top: 30px;">
        <table class="info-grid">
            <tr>
                <td class="info-col" style="border-{{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }}: 4px solid #f97316;">
                    <div class="section-title">{{ __('CUSTOMER') }}</div>
                    <strong style="font-size: 14px;">{{ $rentalReturn->contract->customer->name }}</strong><br>
                    {{ __('Contract') }}: {{ $rentalReturn->contract->contract_number }}
                </td>
                <td class="spacer-col"></td>
                <td class="info-col" style="border-{{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }}: 4px solid #f97316;">
                    <div class="section-title">{{ __('WAREHOUSE SOURCE') }}</div>
                    <strong>{{ $rentalReturn->contract->warehouse->name ?? __('Default Warehouse') }}</strong><br>
                    {{ __('Condition') }}: <span style="text-transform: uppercase; font-weight: bold;">{{ __($rentalReturn->condition) }}</span>
                </td>
            </tr>
        </table>

        <div class="section-title">{{ __('RETURNED ASSET') }}</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>{{ __('Material Description') }}</th>
                    <th>{{ __('SKU') }}</th>
                    <th style="text-align: center;">{{ __('Quantity Returned') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>{{ $rentalReturn->product->name }}</strong></td>
                    <td>{{ $rentalReturn->product->sku }}</td>
                    <td style="text-align: center; font-size: 16px; font-weight: bold;">{{ $rentalReturn->returned_quantity }}</td>
                </tr>
            </tbody>
        </table>

        @if($rentalReturn->damage_fee > 0 || $rentalReturn->damage_notes)
        <div class="damage-box">
            <div style="font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">{{ __('Damage & Loss Assessment') }}</div>
            <table style="width: 100%;">
                <tr>
                    <td style="vertical-align: top;">
                        {{ $rentalReturn->damage_notes ?: __('No specific damage notes recorded.') }}
                    </td>
                    <td style="text-align: right; vertical-align: bottom; font-size: 14px; font-weight: bold;">
                        {{ __('Fee') }}: {{ number_format($rentalReturn->damage_fee, 2) }}
                    </td>
                </tr>
            </table>
        </div>
        @endif
        
        <p style="margin-top: 30px; font-size: 10px; color: #64748b; font-style: italic;">
            {{ __('Disclaimer: This document serves as a formal acknowledgement of the materials returned to the warehouse. Final reconciliation of account balance will be performed during the next billing cycle.') }}
        </p>
    </div>

    <div class="signature-section">
        <div class="sig-line" style="float: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }};">
            <small style="color:#64748b">{{ __('CUSTOMER SIGNATURE') }}</small>
            <p style="margin: 20px 0 0 0;">_______________________</p>
        </div>
        <div class="sig-spacer" style="float: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }};"></div>
        <div class="sig-line" style="float: {{ in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'right' : 'left' }};">
            <small style="color:#64748b">{{ __('WAREHOUSE INSPECTOR') }}</small>
            <p style="margin: 20px 0 0 0;">_______________________</p>
        </div>
        <div class="clearfix"></div>
    </div>

    <div class="footer">
        {{ __('SUKOUN ALBUNYAN RENTAL SYSTEM') }} | {{ date('Y-m-d H:i') }} | PAGE 1 OF 1
    </div>
</body>
</html>
