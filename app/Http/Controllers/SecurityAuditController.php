<?php

namespace App\Http\Controllers;

use App\Models\DionAuditLog;
use Inertia\Inertia;

class SecurityAuditController extends Controller
{
    /**
     * Display the Zero-Trust Audit Log panel.
     */
    public function index()
    {
        // For production, we'd load and paginate DionAuditLog::latest()->take(100)->get()
        return Inertia::render('MissionCommand/SecurityAudit/Index');
    }
}
