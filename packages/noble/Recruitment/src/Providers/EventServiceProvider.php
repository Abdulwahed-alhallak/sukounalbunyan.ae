<?php

namespace Noble\Recruitment\Providers;

use App\Events\DefaultData;
use App\Events\GivePermissionToRole;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Recruitment\Listeners\DataDefault;
use Noble\Recruitment\Listeners\GiveRoleToPermission;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        DefaultData::class => [
            DataDefault::class,
        ],
        GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
    ];
}