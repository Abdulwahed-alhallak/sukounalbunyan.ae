<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ __('Labels') }} - {{ $contract->contract_number }}</title>
    <style>
        @page { margin: 0; }
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            margin: 0; 
            padding: 0; 
            width: 80mm; 
            height: 50mm;
            overflow: hidden;
        }
        .label-container {
            width: 80mm;
            height: 50mm;
            padding: 2mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            border-bottom: 1px dashed #ccc;
            page-break-after: always;
        }
        .header {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 2mm;
            border-bottom: 1px solid #eee;
            padding-bottom: 1mm;
        }
        .content {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 35mm;
        }
        .qr-code {
            width: 30mm;
            height: 30mm;
        }
        .info {
            width: 44mm;
            font-size: 9px;
            line-height: 1.2;
        }
        .product-name {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 1mm;
            display: block;
        }
        .contract-ref {
            font-size: 8px;
            color: #666;
        }
        .footer {
            font-size: 7px;
            text-align: right;
            margin-top: auto;
        }
    </style>
</head>
<body>

{{-- Contract General Label --}}
<div class="label-container">
    <div class="header">{{ __('RENTAL CONTRACT') }}</div>
    <div class="content">
        <div class="info">
            <span class="product-name">{{ $contract->customer->name ?? 'N/A' }}</span>
            <div><strong>{{ $contract->contract_number }}</strong></div>
            <div class="contract-ref">{{ __('Site') }}: {{ $contract->site_name ?? 'N/A' }}</div>
            <div class="contract-ref">{{ __('Start') }}: {{ $contract->start_date }}</div>
        </div>
        <div class="qr-code">
            <img src="data:image/png;base64, {!! base64_encode(QrCode::format('png')->size(150)->generate(route('rental.show', $contract->id))) !!} ">
        </div>
    </div>
    <div class="footer">{{ now()->format('Y-m-d H:i') }} | Noble Rental System</div>
</div>

{{-- Item Labels --}}
@foreach($contract->items as $item)
<div class="label-container">
    <div class="header">{{ __('EQUIPMENT ASSET') }}</div>
    <div class="content">
        <div class="info">
            <span class="product-name">{{ $item->product->name ?? 'N/A' }}</span>
            <div>{{ __('Qty') }}: {{ $item->quantity }}</div>
            <div class="contract-ref">REF: {{ $contract->contract_number }}</div>
            <div class="contract-ref">{{ $contract->customer->name ?? '' }}</div>
        </div>
        <div class="qr-code">
            <img src="data:image/png;base64, {!! base64_encode(QrCode::format('png')->size(150)->generate(route('rental.scan-qr', ['contract' => $contract->id, 'product' => $item->product_id]))) !!} ">
        </div>
    </div>
    <div class="footer">Noble Scaffolding Logic</div>
</div>
@endforeach

</body>
</html>
