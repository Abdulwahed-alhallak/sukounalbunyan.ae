<?php

namespace Noble\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\FormBuilder\Models\Form;

class DestroyForm
{
    use Dispatchable;

    public function __construct(
        public Form $form
    ) {}
}