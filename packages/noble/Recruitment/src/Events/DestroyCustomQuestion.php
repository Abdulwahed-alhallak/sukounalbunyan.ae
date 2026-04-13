<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\CustomQuestion;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCustomQuestion
{
    use Dispatchable;

    public function __construct(
        public CustomQuestion $customQuestion
    ) {}
}