<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\ChecklistItem;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateChecklistItem
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ChecklistItem $checklistItem
    ) {}
}