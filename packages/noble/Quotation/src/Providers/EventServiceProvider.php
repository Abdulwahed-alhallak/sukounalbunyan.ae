<?php

namespace Noble\Quotation\Providers;

use App\Events\GivePermissionToRole;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Quotation\Listeners\GiveRoleToPermission;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
    ];
}