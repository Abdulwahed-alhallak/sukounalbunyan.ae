<?php

namespace Noble\Taskly\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'budget' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location_name' => 'nullable|string|max:255',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'geofence_radius' => 'nullable|integer|min:1',
            'status' => 'nullable|in:Ongoing,Onhold,Finished',
        ];
    }
}
