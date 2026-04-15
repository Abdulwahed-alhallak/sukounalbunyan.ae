<?php
/**
 * Extract all users with their credentials and roles
 */
require __DIR__.'/../../vendor/autoload.php';
$app = require_once __DIR__.'/../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "═══════════════════════════════════════════════════\n";
echo "📋 NOBLE ARCHITECTURE — USER CREDENTIALS REPORT\n";
echo "═══════════════════════════════════════════════════\n\n";

$users = User::with('roles')->orderBy('type')->orderBy('id')->get();

$output = "# Noble Architecture — User Credentials\n";
$output .= "# Generated: " . date('Y-m-d H:i:s') . "\n";
$output .= "# Note: All passwords are hashed. Default password: Noble@2026\n\n";
$output .= str_pad("ID", 5) . " | " . str_pad("Type", 12) . " | " . str_pad("Email", 35) . " | " . str_pad("Name", 35) . " | Roles\n";
$output .= str_repeat("-", 130) . "\n";

$stats = ['total' => 0, 'company' => 0, 'super admin' => 0, 'staff' => 0, 'other' => 0];

foreach ($users as $user) {
    $roles = $user->roles->pluck('name')->implode(', ') ?: '-';
    $line = str_pad($user->id, 5) . " | " . str_pad($user->type ?? '-', 12) . " | " . str_pad($user->email, 35) . " | " . str_pad(mb_substr($user->name, 0, 33), 35) . " | " . $roles;
    $output .= $line . "\n";
    
    $stats['total']++;
    if (isset($stats[$user->type])) {
        $stats[$user->type]++;
    } else {
        $stats['other']++;
    }
}

$output .= "\n# SUMMARY:\n";
$output .= "# Total Users: {$stats['total']}\n";
$output .= "# Super Admins: {$stats['super admin']}\n";
$output .= "# Company: {$stats['company']}\n";  
$output .= "# Staff: {$stats['staff']}\n";

// Save to file
$reportPath = __DIR__ . '/../../docs/Archive/user_credentials_report.txt';
file_put_contents($reportPath, $output);

echo $output;
echo "\n✅ Report saved to: docs/Archive/user_credentials_report.txt\n";

// Also output employee count
$employeeCount = \Noble\Hrm\Models\Employee::count();
echo "\n📊 Employees in DB: {$employeeCount}\n";
