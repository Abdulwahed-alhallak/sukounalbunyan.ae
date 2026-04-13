<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Account\Models\CreditNote;

class DestroyCreditNote
{

    use Dispatchable;

    public function __construct(
        public CreditNote $creditNote
    ) {}
}