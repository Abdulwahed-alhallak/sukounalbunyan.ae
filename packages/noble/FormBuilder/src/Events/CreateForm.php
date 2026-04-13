<?php

namespace Noble\FormBuilder\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\FormBuilder\Models\Form;

class CreateForm
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Form $form
    ) {}
}