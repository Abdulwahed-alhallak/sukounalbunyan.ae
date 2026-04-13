<?php

namespace Noble\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\FormBuilder\Models\Form;
use Noble\FormBuilder\Models\FormResponse;

class ViewForm
{
    use Dispatchable;

    public function __construct(
        public Form $form,
        public FormResponse $response
    ) {}
}