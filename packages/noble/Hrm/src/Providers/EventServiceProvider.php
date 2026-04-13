<?php

namespace Noble\Hrm\Providers;

use App\Events\DefaultData;
use Noble\Hrm\Listeners\DataDefault;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\GivePermissionToRole;
use Noble\Hrm\Listeners\GiveRoleToPermission;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        \App\Events\DefaultData::class => [
            \Noble\Hrm\Listeners\DataDefault::class
        ],
        \App\Events\CreateUser::class => [
            \Noble\Hrm\Listeners\CreateEmployeeFromUser::class
        ],
         GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
    ];
}
