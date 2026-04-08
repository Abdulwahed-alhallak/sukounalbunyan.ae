<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Deal;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class DealAddUser
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Deal $deal,
    ) {}
}