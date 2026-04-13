<?php

namespace Noble\FormBuilder\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\GivePermissionToRole;
use Noble\FormBuilder\Listeners\GiveRoleToPermission;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Form conversion events
        GivePermissionToRole::class => [
            GiveRoleToPermission::class,
        ],
    ];
}
