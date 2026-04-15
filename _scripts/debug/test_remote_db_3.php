<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config([
    'database.connections.mysql.host' => '193.203.166.17',
    'database.connections.mysql.database' => 'u256167180_noble',
    'database.connections.mysql.username' => 'u256167180_noble',
    'database.connections.mysql.password' => 'm:&!u>Do!P3',
]);

try {
    $remote_migrations = \DB::table('migrations')->pluck('migration')->toArray();
    $local_migrations = [
        '2026_04_06_110141_add_polymorphic_fields_to_task_attachments_table',
        '2026_04_07_000000_add_grand_total_to_pos_table',
        '2026_04_07_150419_add_manager_approval_fields_to_leave_applications',
        '2026_04_07_155327_create_biometric_logs_table',
        '2026_04_07_163706_add_approval_fields_to_loans_and_awards_table',
        '2026_04_07_174000_add_manager_approval_fields_to_resignations_table',
        '2026_04_07_184500_add_manager_approval_fields_to_complaints_table',
        '2026_04_08_010000_create_company_assets_table',
        '2026_04_08_010100_create_employee_onboardings_table',
        '2026_04_08_010200_create_vacation_settlements_table',
        '2026_04_08_010300_create_final_settlements_table',
        '2026_04_08_042653_create_employee_contracts_table'
    ];

    $batch_query = \DB::table('migrations')->max('batch');
    $next_batch = $batch_query ? $batch_query + 1 : 1;

    $diff = array_diff($local_migrations, $remote_migrations);

    foreach($diff as $mig) {
        echo "Inserting migration: $mig\n";
        \DB::table('migrations')->insert([
            'migration' => $mig,
            'batch' => $next_batch,
        ]);
    }
    
    echo "Done.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

