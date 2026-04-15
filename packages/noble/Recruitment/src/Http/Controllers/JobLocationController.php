<?php

namespace Noble\Recruitment\Http\Controllers;

use Noble\Recruitment\Models\JobLocation;
use Noble\Recruitment\Http\Requests\StoreJobLocationRequest;
use Noble\Recruitment\Http\Requests\UpdateJobLocationRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Noble\Recruitment\Events\CreateJobLocation;
use Noble\Recruitment\Events\UpdateJobLocation;
use Noble\Recruitment\Events\DestroyJobLocation;


class JobLocationController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-job-locations')) {
            $joblocations = JobLocation::query()

                ->where(function ($q) {
                    if (Auth::user()->can('manage-any-job-locations')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-job-locations')) {
                        $q->where('creator_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->when(request('name'), function ($q) {
                    $q->where(function ($query) {
                        $query->where('name', 'like', '%' . request('name') . '%');
                        $query->orWhere('city', 'like', '%' . request('name') . '%');
                        $query->orWhere('state', 'like', '%' . request('name') . '%');
                        $query->orWhere('country', 'like', '%' . request('name') . '%');
                    });
                })
                ->when(request('status') !== null && request('status') !== '', fn($q) => $q->where('status', request('status')))
                ->when(request('remote_work') !== null && request('remote_work') !== '', fn($q) => $q->where('remote_work', request('remote_work')))

                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('Recruitment/JobLocations/Index', [
                'joblocations' => $joblocations,

            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreJobLocationRequest $request)
    {
        if (Auth::user()->can('create-job-locations')) {
            $validated = $request->validated();

            $validated['status'] = $request->boolean('status', false);

            $joblocation = new JobLocation();
            $joblocation->fill($validated);
            $joblocation->creator_id = Auth::id();
            $joblocation->created_by = creatorId();
            $joblocation->save();

            CreateJobLocation::dispatch($request, $joblocation);

            return redirect()->route('recruitment.job-locations.index')->with('success', __('The job location has been created successfully.'));
        } else {
            return redirect()->route('recruitment.job-locations.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateJobLocationRequest $request, JobLocation $joblocation)
    {
        if (Auth::user()->can('edit-job-locations')) {
            $validated = $request->validated();

            $validated['status'] = $request->boolean('status', false);

            $joblocation->fill($validated);
            $joblocation->save();

            UpdateJobLocation::dispatch($request, $joblocation);

            return redirect()->back()->with('success', __('The job location details are updated successfully.'));
        } else {
            return redirect()->route('recruitment.job-locations.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(JobLocation $joblocation)
    {
        if (Auth::user()->can('delete-job-locations')) {
            DestroyJobLocation::dispatch($joblocation);
            $joblocation->delete();

            return redirect()->back()->with('success', __('The job location has been deleted.'));
        } else {
            return redirect()->route('recruitment.job-locations.index')->with('error', __('Permission denied'));
        }
    }
}
