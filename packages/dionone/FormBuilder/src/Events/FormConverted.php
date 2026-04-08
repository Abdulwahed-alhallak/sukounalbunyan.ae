<?php

namespace DionONE\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use DionONE\FormBuilder\Models\Form;
use DionONE\FormBuilder\Models\FormConversion;

class FormConverted
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Form $form,
        public FormConversion $conversion
    ) {}
}