<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ __('Logistics Note') }} - {{ $contract->contract_number }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 24px; color: #111; }
        .header p { margin: 5px 0 0 0; font-size: 14px; color: #666; }
        .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .info-table td { padding: 5px; vertical-align: top; }
        .info-table .label { font-weight: bold; width: 30%; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .items-table th { background-color: #f8f9fa; font-weight: bold; }
        .footer { margin-top: 50px; }
        .signature-box { width: 45%; display: inline-block; text-align: center; margin-top: 40px; }
        .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
    </style>
</head>
<body>

<div class="header">
    <h1>{{ __('Delivery / Pickup Note') }}</h1>
    <p>{{ __('Contract Ref') }}: <strong>{{ $contract->contract_number }}</strong></p>
</div>

<table class="info-table">
    <tr>
        <td class="label">{{ __('Customer') }}:</td>
        <td>{{ $contract->customer->name ?? 'N/A' }}</td>
        <td class="label">{{ __('Date') }}:</td>
        <td>{{ now()->format('Y-m-d') }}</td>
    </tr>
    <tr>
        <td class="label">{{ __('Site Name') }}:</td>
        <td>{{ $contract->site_name ?? 'N/A' }}</td>
        <td class="label">{{ __('Status') }}:</td>
        <td>{{ strtoupper(str_replace('_', ' ', $contract->logistics_status ?? 'N/A')) }}</td>
    </tr>
    <tr>
        <td class="label">{{ __('Site Address') }}:</td>
        <td colspan="3">{{ $contract->site_address ?? 'N/A' }}</td>
    </tr>
    <tr>
        <td class="label">{{ __('Contact Person') }}:</td>
        <td>{{ $contract->site_contact_person ?? 'N/A' }}</td>
        <td class="label">{{ __('Contact Phone') }}:</td>
        <td>{{ $contract->site_contact_phone ?? 'N/A' }}</td>
    </tr>
</table>

<h3>{{ __('Equipment List') }}</h3>
<table class="items-table">
    <thead>
        <tr>
            <th>#</th>
            <th>{{ __('Item Description') }}</th>
            <th>{{ __('Quantity') }}</th>
            <th>{{ __('Notes / Checklist') }}</th>
        </tr>
    </thead>
    <tbody>
        @foreach($contract->items as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $item->product->name ?? 'Unknown Item' }}</td>
            <td>{{ $item->quantity }}</td>
            <td></td>
        </tr>
        @endforeach
    </tbody>
</table>

<div class="footer">
    <div class="signature-box">
        <p>{{ __('Delivered By / Logistics Team') }}</p>
        <div class="signature-line">{{ __('Signature & Date') }}</div>
    </div>
    <div class="signature-box" style="float: right;">
        <p>{{ __('Received By / Customer Representative') }}</p>
        <div class="signature-line">{{ __('Signature & Date') }}</div>
    </div>
</div>

</body>
</html>
