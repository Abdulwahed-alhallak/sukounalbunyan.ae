<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    $count = \Noble\Hrm\Models\EmployeeContract::count();
    echo "Contracts count: $count\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    
    // Try creating the table
    if (str_contains($e->getMessage(), "doesn't exist")) {
        echo "Table missing. Creating it...\n";
        \Illuminate\Support\Facades\Schema::create('employee_contracts', function ($table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('contract_type')->default('Fixed Term');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('probation_end_date')->nullable();
            $table->decimal('basic_salary', 10, 2)->nullable();
            $table->string('status')->default('Active');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');
        });
        echo "Table created successfully!\n";
    }
}
