<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CreateDocumentType
{
    use Dispatchable, SerializesModels;

    public function __construct()
    {
        //
    }
}