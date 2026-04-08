<?php

namespace DionONE\ProductService\Providers;

use App\Events\PostPurchaseInvoice;
use App\Events\ApprovePurchaseReturn;
use App\Events\CompleteSalesReturn;
use App\Events\PostSalesInvoice;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use DionONE\Pos\Events\CreatePos;
use DionONE\ProductService\Listeners\PostPurchaseInvoiceListener;
use DionONE\ProductService\Listeners\ApprovePurchaseReturnListener;
use DionONE\ProductService\Listeners\CompleteSalesReturnListener;
use DionONE\ProductService\Listeners\PosCreateListener;
use DionONE\ProductService\Listeners\PostSalesInvoiceListener;
use DionONE\Retainer\Events\ConvertSalesRetainer;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        PostPurchaseInvoice::class => [
            PostPurchaseInvoiceListener::class,
        ],
        PostSalesInvoice::class => [
            PostSalesInvoiceListener::class,
        ],
        ApprovePurchaseReturn::class => [
            ApprovePurchaseReturnListener::class,
        ],
        CompleteSalesReturn::class => [
            CompleteSalesReturnListener::class,
        ],
        CreatePos::class => [
            PosCreateListener::class,
        ],
        ConvertSalesRetainer::class => [
            CompleteSalesReturnListener::class,
        ],
    ];
}
