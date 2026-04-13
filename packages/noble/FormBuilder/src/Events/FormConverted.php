<?php

namespace Noble\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\FormBuilder\Models\Form;
use Noble\FormBuilder\Models\FormConversion;

class FormConverted
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Form $form,
        public FormConversion $conversion
    ) {}
}