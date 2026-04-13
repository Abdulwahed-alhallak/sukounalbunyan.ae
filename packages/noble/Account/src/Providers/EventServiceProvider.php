<?php

namespace Noble\Account\Providers;

use App\Events\ApprovePurchaseReturn;
use App\Events\ApproveSalesReturn;
use App\Events\CreateTransfer;
use App\Events\DefaultData;
use App\Events\DestroyTransfer;
use App\Events\GivePermissionToRole;
use App\Events\PostPurchaseInvoice;
use App\Events\PostSalesInvoice;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Account\Listeners\BankAccountFieldUpdate;
use Noble\Account\Listeners\CreateDebitNoteFromReturn;
use Noble\Account\Listeners\CreateCreditNoteFromReturn;
use Noble\Account\Listeners\UpdateMobileServicePaymentStatusLis;
use Noble\Account\Listeners\DataDefault;
use Noble\Account\Listeners\PostPurchaseInvoiceListener;
use Noble\Account\Listeners\CreateTransferListener;
use Noble\Account\Listeners\DestroyTransferListener;
use Noble\Account\Listeners\GiveRoleToPermission;
use Noble\Account\Listeners\PostSalesInvoiceListener;
use Noble\Account\Listeners\UpdateRetainerPaymentStatusListener;
use Noble\Retainer\Events\UpdateRetainerPaymentStatus;
use Noble\Account\Listeners\UpdateCommissionPaymentStatusListener;
use Noble\Commission\Events\UpdateCommissionPaymentStatus;
use Noble\Account\Listeners\PaySalaryListener;
use Noble\Hrm\Events\PaySalary;
use Noble\Account\Listeners\CreatePosListener;
use Noble\Fleet\Events\MarkFleetBookingPaymentPaid;
use Noble\MobileServiceManagement\Events\UpdateMobileServicePaymentStatus;
use Noble\Pos\Events\CreatePos;
use Noble\Account\Listeners\MarkFleetBookingPaymentPaidListener;
use Noble\Fleet\Events\CraeteFleetBookingPayment;
use Noble\MobileServiceManagement\Events\CreateMobileServicePayment;
use Noble\Account\Listeners\BeautyBookingPaymentListener;
use Noble\DairyCattleManagement\Events\CreateDairyCattlePayment;
use Noble\DairyCattleManagement\Events\UpdateDairyCattlePaymentStatus;
use Noble\Paypal\Events\BeautyBookingPaymentPaypal;
use Noble\Stripe\Events\BeautyBookingPaymentStripe;
use Noble\Account\Listeners\UpdateDairyCattlePaymentStatusListener;
use Noble\CateringManagement\Events\CreateCateringOrderPayment;
use Noble\CateringManagement\Events\UpdateCateringOrderPaymentStatus;
use Noble\Account\Listeners\UpdateCateringOrderPaymentStatusListener;
use Noble\Account\Listeners\UpdatePropertyPaymentStatusListener;
use Noble\Account\Listeners\UpdateSalesAgentCommissionPaymentStatusLis;
use Noble\Account\Listeners\ApproveSalesAgentCommissionAdjustmentLis;
use Noble\Account\Listeners\ConvertSalesRetainerListener;
use Noble\Commission\Events\CreateCommissionPayment;
use Noble\PropertyManagement\Events\CreatePropertyPayment;
use Noble\PropertyManagement\Events\UpdatePropertyPaymentStatus;
use Noble\Hrm\Events\CreatePayroll;
use Noble\Hrm\Events\UpdatePayroll;
use Noble\Retainer\Events\ConvertSalesRetainer;
use Noble\SalesAgent\Events\CreateSalesAgentCommissionPayment;
use Noble\SalesAgent\Events\UpdateSalesAgentCommissionPaymentStatus;
use Noble\SalesAgent\Events\ApproveSalesAgentCommissionAdjustment;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Add your event listeners here
        DefaultData::class => [
            DataDefault::class,
        ],
        GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
        PostPurchaseInvoice::class => [
            PostPurchaseInvoiceListener::class,
        ],
        PostSalesInvoice::class => [
            PostSalesInvoiceListener::class,
        ],
        CreateTransfer::class => [
            CreateTransferListener::class,
        ],
        DestroyTransfer::class => [
            DestroyTransferListener::class,
        ],
        ApprovePurchaseReturn::class => [
            CreateDebitNoteFromReturn::class,
        ],
        ApproveSalesReturn::class => [
            CreateCreditNoteFromReturn::class,
        ],
        UpdateRetainerPaymentStatus::class => [
            UpdateRetainerPaymentStatusListener::class,
        ],
        ConvertSalesRetainer::class => [
            ConvertSalesRetainerListener::class,
        ],
        CreateCommissionPayment::class => [
            BankAccountFieldUpdate::class,
        ],
        UpdateCommissionPaymentStatus::class => [
            UpdateCommissionPaymentStatusListener::class,
        ],
        PaySalary::class => [
            PaySalaryListener::class,
        ],
        CreatePos::class => [
            BankAccountFieldUpdate::class,
            CreatePosListener::class,
        ],
        CreateMobileServicePayment::class => [
            BankAccountFieldUpdate::class,
        ],
        UpdateMobileServicePaymentStatus::class => [
            UpdateMobileServicePaymentStatusLis::class,
        ],
        CraeteFleetBookingPayment::class => [
            BankAccountFieldUpdate::class,
        ],
        MarkFleetBookingPaymentPaid::class => [
            MarkFleetBookingPaymentPaidListener::class,
        ],
        BeautyBookingPaymentStripe::class => [
            BeautyBookingPaymentListener::class,
        ],
        BeautyBookingPaymentPaypal::class => [
            BeautyBookingPaymentListener::class,
        ],
        CreateDairyCattlePayment::class => [
            BankAccountFieldUpdate::class,
        ],
        UpdateDairyCattlePaymentStatus::class => [
            UpdateDairyCattlePaymentStatusListener::class,
        ],
        CreateCateringOrderPayment::class => [
            BankAccountFieldUpdate::class,
        ],
        UpdateCateringOrderPaymentStatus::class => [
            UpdateCateringOrderPaymentStatusListener::class,
        ],
        CreatePropertyPayment::class => [
            BankAccountFieldUpdate::class,
        ],
        CreatePayroll::class => [
            BankAccountFieldUpdate::class,
        ],
        UpdatePayroll::class => [
            BankAccountFieldUpdate::class,
        ],
        CreateSalesAgentCommissionPayment::class => [
            BankAccountFieldUpdate::class,
        ],
        UpdateSalesAgentCommissionPaymentStatus::class => [
            UpdateSalesAgentCommissionPaymentStatusLis::class,
        ],
        ApproveSalesAgentCommissionAdjustment::class => [
            ApproveSalesAgentCommissionAdjustmentLis::class,
        ],

    ];
}
