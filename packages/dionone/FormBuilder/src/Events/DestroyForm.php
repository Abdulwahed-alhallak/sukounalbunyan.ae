<?php

namespace DionONE\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\FormBuilder\Models\Form;

class DestroyForm
{
    use Dispatchable;

    public function __construct(
        public Form $form
    ) {}
}