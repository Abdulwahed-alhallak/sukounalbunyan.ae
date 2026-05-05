<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rental Contract {{ $contract->contract_number }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 40px;
            color: #27272a; 
            font-size: 13px;
            line-height: 1.6;
            direction: rtl;
        }
        .header {
            width: 100%;
            border-bottom: 2px solid #0891b2; /* cyan-600 */
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header td { vertical-align: middle; }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #09090b;
        }
        .logo span { color: #0891b2; }
        
        .title-box {
            text-align: left;
        }
        .document-title {
            font-size: 26px;
            color: #18181b;
            margin: 0;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .info-grid {
            width: 100%;
            margin-bottom: 30px;
        }
        .info-grid td {
            width: 50%;
            vertical-align: top;
            padding: 10px;
            border: 1px solid #f4f4f5;
        }
        .section-title {
            font-weight: bold;
            color: #0891b2;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 8px;
            border-bottom: 1px solid #e4e4e7;
            padding-bottom: 4px;
        }
        
        .table-items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .table-items th {
            background-color: #09090b;
            color: #ffffff;
            padding: 10px;
            text-align: right;
            font-size: 12px;
        }
        .table-items td {
            padding: 10px;
            border-bottom: 1px solid #e4e4e7;
        }
        
        .security-box {
            background-color: #fffbeb; /* amber-50 */
            border: 1px solid #fcd34d; /* amber-300 */
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 4px;
        }
        .security-title {
            color: #92400e; /* amber-800 */
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
        }

        .footer {
            position: fixed;
            bottom: 30px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 10px;
            color: #a1a1aa;
            border-top: 1px solid #e4e4e7;
            padding-top: 10px;
        }
        
        .watermark {
            position: absolute;
            top: 45%;
            left: 20%;
            font-size: 80px;
            color: rgba(0,0,0,0.03);
            transform: rotate(-45deg);
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="watermark">OFFICIAL CONTRACT</div>

    <table class="header">
        <tr>
            <td style="width: 50%;">
                <div class="logo">SUKOUN<span>RENTAL</span></div>
                <div style="margin-top: 5px; font-size: 11px; color: #71717a;">
                    Sukoun Albunyan Scaffolding & Trading LLC<br>
                    Industrial Area 15, Dubai, UAE<br>
                    info@sukounalbunyan.ae | +971 4 XXX XXXX
                </div>
            </td>
            <td class="title-box">
                <h1 class="document-title">عقد تأجير</h1>
                <div style="font-size: 14px; font-weight: bold; margin-top: 5px;">
                    رقم العقد: {{ $contract->contract_number }}
                </div>
                <div style="font-size: 12px; color: #71717a;">
                    التاريخ: {{ $contract->start_date }}
                </div>
            </td>
        </tr>
    </table>

    <table class="info-grid">
        <tr>
            <td>
                <div class="section-title">بيانات المستأجر (Client Information)</div>
                <strong>{{ $contract->customer->name }}</strong><br>
                العنوان: {{ $contract->site_address ?? 'N/A' }}<br>
                المسؤول: {{ $contract->site_contact_person ?? 'N/A' }}<br>
                الهاتف: {{ $contract->site_contact_phone ?? 'N/A' }}
            </td>
            <td>
                <div class="section-title">بيانات الموقع والمشروع (Site Info)</div>
                المشروع: {{ $contract->project->name ?? 'Direct Rental' }}<br>
                اسم الموقع: {{ $contract->site_name ?? 'N/A' }}<br>
                دورة الفوترة: {{ ucfirst($contract->billing_cycle) }}<br>
                أقل مدة تأجير: {{ $contract->min_days }} يوم
            </td>
        </tr>
    </table>

    @if($contract->security_deposit_check)
    <div class="security-box">
        <span class="security-title">ضمان التأجير (Security Guarantee)</span>
        تم استلام شيك ضمان برقم <strong>({{ $contract->security_deposit_check }})</strong> 
        بقيمة <strong>({{ number_format($contract->security_deposit_amount, 2) }} AED)</strong>.
        @if($contract->security_deposit_notes)
            <br><small>ملاحظات: {{ $contract->security_deposit_notes }}</small>
        @endif
    </div>
    @endif

    <table class="table-items">
        <thead>
            <tr>
                <th style="width: 50%">المادة / الوصف (Item Description)</th>
                <th style="width: 15%">الكمية</th>
                <th style="width: 15%">سعر الدورة</th>
                <th style="width: 20%">الإجمالي المتوقع</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contract->items as $item)
            <tr>
                <td><strong>{{ $item->product->name }}</strong></td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->price_per_cycle, 2) }}</td>
                <td>{{ number_format($item->quantity * $item->price_per_cycle, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 40px;">
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%; text-align: center;">
                    <div style="border-bottom: 1px solid #000; width: 150px; margin: 0 auto 10px;"></div>
                    ختم وتوقيع المستأجر
                </td>
                <td style="width: 50%; text-align: center;">
                    <div style="border-bottom: 1px solid #000; width: 150px; margin: 0 auto 10px;"></div>
                    ختم وتوقيع شركة سكون البنيان
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        هذا المستند تم توليده آلياً من نظام Sukoun Rental وهو ملزم قانوناً بمجرد التوقيع.<br>
        Sukoun Albunyan Enterprise Resource Planning System v3.0
    </div>
</body>
</html>
