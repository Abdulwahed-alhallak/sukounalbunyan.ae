<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Account\Models\DebitNote;

class ApproveDebitNote
{
    use Dispatchable;

    public function __construct(
        public DebitNote $debitNote
    ) {}
}
