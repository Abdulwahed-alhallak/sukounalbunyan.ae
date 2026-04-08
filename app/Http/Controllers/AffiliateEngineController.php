<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AffiliateEngineController extends Controller
{
    /**
     * Display the Affiliate & Retention Engine Dashboard.
     */
    public function index()
    {
        return Inertia::render('MissionCommand/AffiliateEngine/Index');
    }
}
