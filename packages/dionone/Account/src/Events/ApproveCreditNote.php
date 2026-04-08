<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Account\Models\CreditNote;

class ApproveCreditNote
{
    use Dispatchable;

    public function __construct(
        public CreditNote $creditNote
    ) {}
}