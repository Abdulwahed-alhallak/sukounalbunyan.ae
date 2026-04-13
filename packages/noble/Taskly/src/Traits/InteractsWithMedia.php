<?php

namespace Noble\Taskly\Traits;

use Noble\Taskly\Models\TaskAttachment;
use Illuminate\Support\Facades\Auth;

trait InteractsWithMedia
{
    public function attachments()
    {
        return $this->morphMany(TaskAttachment::class, 'attachable')->with('uploader');
    }

    public function syncAttachments($mediaPaths)
    {
        if (!$mediaPaths) return;

        $paths = is_array($mediaPaths) ? $mediaPaths : [$mediaPaths];

        foreach ($paths as $path) {
            if (empty($path)) continue;

            $this->attachments()->create([
                'file_name' => basename($path),
                'file_path' => basename($path), // We store the basename as per existing pattern
                'uploaded_by' => Auth::id(),
                'creator_id' => Auth::id(),
                'created_by' => creatorId(),
            ]);
        }
    }
}
