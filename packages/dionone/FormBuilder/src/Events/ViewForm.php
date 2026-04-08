<?php

namespace DionONE\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\FormBuilder\Models\Form;
use DionONE\FormBuilder\Models\FormResponse;

class ViewForm
{
    use Dispatchable;

    public function __construct(
        public Form $form,
        public FormResponse $response
    ) {}
}