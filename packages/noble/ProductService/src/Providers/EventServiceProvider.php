<?php

namespace Noble\ProductService\Providers;

use App\Events\PostPurchaseInvoice;
use App\Events\ApprovePurchaseReturn;
use App\Events\CompleteSalesReturn;
use App\Events\PostSalesInvoice;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Pos\Events\CreatePos;
use Noble\ProductService\Listeners\PostPurchaseInvoiceListener;
use Noble\ProductService\Listeners\ApprovePurchaseReturnListener;
use Noble\ProductService\Listeners\CompleteSalesReturnListener;
use Noble\ProductService\Listeners\PosCreateListener;
use Noble\ProductService\Listeners\PostSalesInvoiceListener;
use Noble\Retainer\Events\ConvertSalesRetainer;

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
