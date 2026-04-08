<?php

namespace DionONE\Account\Providers;

use App\Events\ApprovePurchaseReturn;
use App\Events\ApproveSalesReturn;
use App\Events\CreateTransfer;
use App\Events\DefaultData;
use App\Events\DestroyTransfer;
use App\Events\GivePermissionToRole;
use App\Events\PostPurchaseInvoice;
use App\Events\PostSalesInvoice;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use DionONE\Account\Listeners\BankAccountFieldUpdate;
use DionONE\Account\Listeners\CreateDebitNoteFromReturn;
use DionONE\Account\Listeners\CreateCreditNoteFromReturn;
use DionONE\Account\Listeners\UpdateMobileServicePaymentStatusLis;
use DionONE\Account\Listeners\DataDefault;
use DionONE\Account\Listeners\PostPurchaseInvoiceListener;
use DionONE\Account\Listeners\CreateTransferListener;
use DionONE\Account\Listeners\DestroyTransferListener;
use DionONE\Account\Listeners\GiveRoleToPermission;
use DionONE\Account\Listeners\PostSalesInvoiceListener;
use DionONE\Account\Listeners\UpdateRetainerPaymentStatusListener;
use DionONE\Retainer\Events\UpdateRetainerPaymentStatus;
use DionONE\Account\Listeners\UpdateCommissionPaymentStatusListener;
use DionONE\Commission\Events\UpdateCommissionPaymentStatus;
use DionONE\Account\Listeners\PaySalaryListener;
use DionONE\Hrm\Events\PaySalary;
use DionONE\Account\Listeners\CreatePosListener;
use DionONE\Fleet\Events\MarkFleetBookingPaymentPaid;
use DionONE\MobileServiceManagement\Events\UpdateMobileServicePaymentStatus;
use DionONE\Pos\Events\CreatePos;
use DionONE\Account\Listeners\MarkFleetBookingPaymentPaidListener;
use DionONE\Fleet\Events\CraeteFleetBookingPayment;
use DionONE\MobileServiceManagement\Events\CreateMobileServicePayment;
use DionONE\Account\Listeners\BeautyBookingPaymentListener;
use DionONE\DairyCattleManagement\Events\CreateDairyCattlePayment;
use DionONE\DairyCattleManagement\Events\UpdateDairyCattlePaymentStatus;
use DionONE\Paypal\Events\BeautyBookingPaymentPaypal;
use DionONE\Stripe\Events\BeautyBookingPaymentStripe;
use DionONE\Account\Listeners\UpdateDairyCattlePaymentStatusListener;
use DionONE\CateringManagement\Events\CreateCateringOrderPayment;
use DionONE\CateringManagement\Events\UpdateCateringOrderPaymentStatus;
use DionONE\Account\Listeners\UpdateCateringOrderPaymentStatusListener;
use DionONE\Account\Listeners\UpdatePropertyPaymentStatusListener;
use DionONE\Account\Listeners\UpdateSalesAgentCommissionPaymentStatusLis;
use DionONE\Account\Listeners\ApproveSalesAgentCommissionAdjustmentLis;
use DionONE\Account\Listeners\ConvertSalesRetainerListener;
use DionONE\Commission\Events\CreateCommissionPayment;
use DionONE\PropertyManagement\Events\CreatePropertyPayment;
use DionONE\PropertyManagement\Events\UpdatePropertyPaymentStatus;
use DionONE\Hrm\Events\CreatePayroll;
use DionONE\Hrm\Events\UpdatePayroll;
use DionONE\Retainer\Events\ConvertSalesRetainer;
use DionONE\SalesAgent\Events\CreateSalesAgentCommissionPayment;
use DionONE\SalesAgent\Events\UpdateSalesAgentCommissionPaymentStatus;
use DionONE\SalesAgent\Events\ApproveSalesAgentCommissionAdjustment;

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
