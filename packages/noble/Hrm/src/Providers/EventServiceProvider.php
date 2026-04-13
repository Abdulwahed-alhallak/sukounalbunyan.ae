<?php

namespace Noble\Hrm\Providers;

use App\Events\DefaultData;
use Noble\Hrm\Listeners\DataDefault;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\GivePermissionToRole;
use Noble\Hrm\Listeners\GiveRoleToPermission;
use App\Events\CreateUser;
use Noble\Hrm\Listeners\CreateEmployeeFromUser;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        DefaultData::class => [
            DataDefault::class
        ],
        CreateUser::class => [
            CreateEmployeeFromUser::class
        ],
         GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
        \App\Events\UpdateUser::class => [
            \Noble\Hrm\Listeners\UpdateEmployeeFromUser::class,
        ],
        \App\Events\DestroyUser::class => [
            \Noble\Hrm\Listeners\DestroyEmployeeFromUser::class,
        ],
    ];
}
