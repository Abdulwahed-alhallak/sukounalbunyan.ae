<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DionFlowController extends Controller
{
    /**
     * Display the DionFlow Studio dashboard.
     */
    public function index()
    {
        $workflows = Workflow::with('steps')
            ->where('company_id', auth()->user()->creatorId())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('MissionCommand/DionFlow/Index', [
            'workflows' => $workflows,
            // Available trigger events for the drag-n-drop builder
            'triggers' => [
                'invoice.created'  => 'Invoice Created',
                'lead.converted'   => 'Lead Converted',
                'employee.hired'   => 'Employee Hired'
            ],
            // Available actions
            'actions' => [
                'send_email'           => 'Send Email',
                'create_task'          => 'Create Taskly Task',
                'generate_pdf_invoice' => 'Auto-Generate PDF Invoice'
            ]
        ]);
    }

    /**
     * Store a newly created workflow.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'trigger_event' => 'required|string',
            'steps'         => 'required|array',
            'steps.*.action_type' => 'required|string',
            'steps.*.configuration' => 'nullable|array',
        ]);

        $workflow = Workflow::create([
            'company_id'    => auth()->user()->creatorId(),
            'name'          => $validated['name'],
            'trigger_event' => $validated['trigger_event'],
            'is_active'     => true,
        ]);

        foreach ($validated['steps'] as $index => $step) {
            $workflow->steps()->create([
                'order_index'   => $index + 1,
                'action_type'   => $step['action_type'],
                'configuration' => json_encode($step['configuration'] ?? []),
            ]);
        }

        return redirect()->back()->with('success', 'DionFlow Workflow successfully deployed! 🛸');
    }
}
