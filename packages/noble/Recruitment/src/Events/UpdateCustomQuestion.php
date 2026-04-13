<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\CustomQuestion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateCustomQuestion
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public CustomQuestion $customQuestion
    ) {}
}