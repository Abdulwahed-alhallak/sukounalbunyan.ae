<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyUser
{
    use Dispatchable;

    public function __construct(
        public User $user
    ) {}
}
