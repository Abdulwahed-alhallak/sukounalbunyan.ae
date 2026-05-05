@php
    $rtl = in_array(app()->getLocale(), ['ar', 'he', 'fa']);
    $dir = $rtl ? 'rtl' : 'ltr';
    $align = $rtl ? 'right' : 'left';
    $revAlign = $rtl ? 'left' : 'right';
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ $dir }}">
<head>
    <meta charset="UTF-8">
    <title>Rental Contract - {{ $contract->contract_number }}</title>
    <style>
        @page { margin: 0px; }
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            font-size: 11px; 
            color: #333; 
            line-height: 1.5; 
            margin: 0; 
            padding: 0; 
            direction: {{ $dir }};
            text-align: {{ $align }};
        }
        .bg-noble { background-color: #0f172a; color: white; }
        .text-noble { color: #0f172a; }
        .text-gold { color: #947c3c; }
        .header { padding: 40px; }
        .header table { width: 100%; border: none; }
        .brand-section { vertical-align: middle; text-align: {{ $align }}; }
        .brand-section h1 { margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; }
        .contract-label { text-align: {{ $revAlign }}; vertical-align: middle; }
        .contract-label h2 { margin: 0; font-size: 18px; color: #947c3c; }
        
        .content { padding: 0 40px; }
        .info-grid { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
        .info-col { 
            width: 48%; 
            vertical-align: top; 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 8px; 
            text-align: {{ $align }};
        }
        .spacer-col { width: 4%; }
        
        .section-title { font-size: 12px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; text-align: {{ $align }}; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 8px; overflow: hidden; }
        .items-table th { background: #1e293b; color: white; padding: 12px; text-align: {{ $align }}; font-size: 10px; text-transform: uppercase; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: {{ $align }}; }
        .items-table tr:nth-child(even) { background: #f8fafc; }
        
        .totals-section { margin-top: 20px; text-align: {{ $revAlign }}; padding: 20px; background: #f1f5f9; border-radius: 8px; }
        .total-row { margin-bottom: 5px; font-size: 12px; }
        .grand-total { font-size: 18px; font-weight: bold; color: #0f172a; border-top: 2px solid #947c3c; padding-top: 10px; margin-top: 10px; }
        
        .terms-box { margin-top: 30px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 10px; color: #475569; text-align: {{ $align }}; }
        
        .signature-section { margin-top: 50px; padding: 0 40px 40px 40px; }
        .sig-line { width: 45%; border-top: 1px solid #94a3b8; text-align: center; padding-top: 10px; }
        .sig-spacer { width: 10%; height: 10px; }
        
        .footer { position: fixed; bottom: 0; width: 100%; padding: 20px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        .clearfix { clear: both; }
    </style>
</head>
<body>
    <div class="bg-noble header">
        <table>
            <tr>
                <td class="brand-section">
                    <h1>SUKOUN <span class="text-gold">RENTAL</span></h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.8;">PREMIUM RENTAL ECOSYSTEM</p>
                </td>
                <td class="contract-label">
                    <h2>{{ __('RENTAL CONTRACT') }}</h2>
                    <p style="margin: 5px 0 0 0;">#{{ $contract->contract_number }}</p>
                    <p style="margin: 0; font-size: 10px;">{{ __('Date') }}: {{ date('Y-m-d') }}</p>
                </td>
            </tr>
        </table>
    </div>

    <div class="content" style="margin-top: 30px;">
        <table class="info-grid">
            <tr>
                <td class="info-col" style="border-{{ $align }}: 4px solid #947c3c;">
                    <div class="section-title">{{ __('CUSTOMER ENTITY') }}</div>
                    <strong style="font-size: 14px;">{{ $contract->customer->name }}</strong><br>
                    {{ $contract->customer->email }}<br>
                    {{ $contract->customer->phone ?? '—' }}
                </td>
                <td class="spacer-col"></td>
                <td class="info-col" style="border-{{ $align }}: 4px solid #947c3c;">
                    <div class="section-title">{{ __('CONTRACT PARAMETERS') }}</div>
                    <table style="width:100%; font-size:11px;">
                        <tr><td>{{ __('Start Date') }}</td><td style="text-align:{{ $revAlign }}"><strong>{{ $contract->start_date->format('Y-m-d') }}</strong></td></tr>
                        <tr><td>{{ __('Cycle') }}</td><td style="text-align:{{ $revAlign }}"><strong>{{ ucfirst(__($contract->billing_cycle)) }}</strong></td></tr>
                        <tr><td>{{ __('Status') }}</td><td style="text-align:{{ $revAlign }}"><strong>{{ strtoupper(__($contract->status)) }}</strong></td></tr>
                    </table>
                </td>
            </tr>
        </table>

        <div class="section-title">{{ __('MANIFEST OF ASSETS') }}</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>{{ __('Description') }}</th>
                    <th style="text-align: center;">{{ __('Quantity') }}</th>
                    <th style="text-align: {{ $revAlign }};">{{ __('Rate per Cycle') }}</th>
                    <th style="text-align: {{ $revAlign }};">{{ __('Line Total') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($contract->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->product->name }}</strong><br>
                        <small style="color:#64748b">SKU: {{ $item->product->sku }}</small>
                    </td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: {{ $revAlign }};">{{ number_format($item->price_per_cycle, 2) }}</td>
                    <td style="text-align: {{ $revAlign }};">{{ number_format($item->quantity * $item->price_per_cycle, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @if($contract->returns->count() > 0)
        <div class="section-title" style="margin-top: 30px;">{{ __('RETURNS & RECONCILIATION') }}</div>
        <table class="items-table" style="border-top: 2px solid #f97316;">
            <thead>
                <tr>
                    <th style="background: #f97316;">{{ __('Returned Material') }}</th>
                    <th style="background: #f97316; text-align: center;">{{ __('Qty Returned') }}</th>
                    <th style="background: #f97316; text-align: {{ $revAlign }};">{{ __('Damage Fee') }}</th>
                    <th style="background: #f97316; text-align: {{ $revAlign }};">{{ __('Return Date') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($contract->returns as $ret)
                <tr>
                    <td>{{ $ret->product->name }}</td>
                    <td style="text-align: center;">{{ $ret->returned_quantity }}</td>
                    <td style="text-align: {{ $revAlign }};">{{ $ret->damage_fee > 0 ? number_format($ret->damage_fee, 2) : '—' }}</td>
                    <td style="text-align: {{ $revAlign }};">{{ $ret->return_date->format('Y-m-d') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <div class="totals-section">
            <div class="total-row">
                <span style="color:#64748b">{{ __('Cycle Total') }}:</span>
                <span style="margin-{{ $align }}: 20px; display: inline-block;">{{ number_format($contract->items->sum(fn($i) => $i->quantity * $i->price_per_cycle), 2) }}</span>
            </div>
            @if($contract->security_deposit > 0)
            <div class="total-row">
                <span style="color:#64748b">{{ __('Security Deposit') }}:</span>
                <span style="margin-{{ $align }}: 20px; display: inline-block;">
                    {{ number_format($contract->security_deposit, 2) }}
                    @if($contract->deposit_status !== 'held')
                        <br><small style="color: #059669;">({{ __($contract->deposit_status) }}: {{ number_format($contract->deposit_settled_amount, 2) }})</small>
                    @endif
                </span>
            </div>
            @endif
            @if($contract->total_damage_fees > 0)
            <div class="total-row">
                <span style="color:#64748b">{{ __('Total Damage Fees') }}:</span>
                <span style="margin-{{ $align }}: 20px; display: inline-block;">{{ number_format($contract->total_damage_fees, 2) }}</span>
            </div>
            @endif
            <div class="grand-total">
                <span>{{ __('RECONCILED VALUE') }}</span>
                <span style="float: {{ $revAlign }};">{{ number_format($contract->items->sum(fn($i) => $i->quantity * $i->price_per_cycle) + $contract->security_deposit + $contract->total_damage_fees, 2) }}</span>
                <div class="clearfix"></div>
            </div>
        </div>

        <div class="section-title" style="margin-top: 30px;">{{ __('CONTRACTUAL TERMS') }}</div>
        <div class="terms-box">
            @if($contract->terms)
                {!! nl2br(e($contract->terms)) !!}
            @else
                {{ __('This contract represents a binding agreement between Sukoun Albunyan and the Client for the rental of specified assets. Late returns are subject to daily penalties as defined in the master service agreement.') }}
            @endif
        </div>
    </div>

    <div class="signature-section">
        <div class="sig-line" style="float: {{ $align }};">
            <small style="color:#64748b">{{ __('CLIENT AUTHORIZATION') }}</small>
            <p style="margin: 20px 0 0 0;">_______________________</p>
        </div>
        <div class="sig-spacer" style="float: {{ $align }};"></div>
        <div class="sig-line" style="float: {{ $align }};">
            <small style="color:#64748b">{{ __('SUKOUN ALBUNYAN SEAL') }}</small>
            <p style="margin: 20px 0 0 0;">_______________________</p>
        </div>
        <div class="clearfix"></div>
    </div>

    <div class="footer">
        {{ __('SUKOUN ALBUNYAN SYSTEM GENERATED DOCUMENT') }} | {{ date('Y-m-d H:i') }} | {{ __('PAGE 1 OF 1') }}
    </div>
</body>
</html>


