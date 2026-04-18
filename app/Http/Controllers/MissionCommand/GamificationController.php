<?php

namespace App\Http\Controllers\MissionCommand;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GamificationRule;
use App\Models\GamificationPoint;
use App\Services\GamificationService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GamificationController extends Controller
{
    public function index()
    {
        $rules = GamificationRule::all();
        // Get top 10 users across the ecosystem
        $leaderboard = GamificationPoint::with('user')->orderBy('points', 'desc')->take(10)->get();

        return Inertia::render('MissionCommand/Gamification', [
            'rules' => $rules,
            'leaderboard' => $leaderboard
        ]);
    }

    public function updateRules(Request $request)
    {
        $data = $request->validate([
            'rules' => 'required|array',
            'rules.*.id' => 'required|integer',
            'rules.*.points_reward' => 'required|integer',
            'rules.*.is_active' => 'required|boolean',
        ]);

        foreach ($data['rules'] as $ruleData) {
            GamificationRule::where('id', $ruleData['id'])->update([
                'points_reward' => $ruleData['points_reward'],
                'is_active' => $ruleData['is_active'],
            ]);
        }

        return redirect()->back()->with('success', 'Gamification mechanics updated effectively.');
    }

    public function createRule(Request $request)
    {
        $data = $request->validate([
            'event_name' => 'required|string|unique:gamification_rules,event_name',
            'description' => 'required|string',
            'points_reward' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        GamificationRule::create($data);

        return redirect()->back()->with('success', 'New loyalty rule established.');
    }

    public function testAward(Request $request)
    {
        $data = $request->validate([
            'event_name' => 'required|string|exists:gamification_rules,event_name',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        $user = Auth::user();
        $userId = $data['user_id'] ?? $user->id;
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        GamificationService::awardPoints($userId, $data['event_name'], $companyId);

        return redirect()->back()->with('success', 'Gamification points awarded successfully.');
    }
}
