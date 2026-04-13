<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\DocumentCategory;

class DestroyDocumentCategory
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public DocumentCategory $documentCategory
    )
    {
        //
    }
}