const fs = require('fs');
const path = require('path');

// Read the CSV or JSON data (assuming I have it from previous steps or can read CSV)
async function prepare() {
    const csvFile = path.resolve(__dirname, '../../nobel Employee S Data.csv');
    // I previously converted this to something I can handle. 
    // For now, I'll just use a small test or search for the JSON.
    
    // Actually, I'll just read the CSV and parse it simply.
    const content = fs.readFileSync(csvFile, 'utf8');
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    const employees = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const values = lines[i].split(',');
        const emp = {};
        headers.forEach((h, idx) => {
            emp[h.trim()] = values[idx] ? values[idx].trim() : null;
        });
        employees.push(emp);
    }

    const phpPayload = `<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$jsonData = hex2bin("${Buffer.from(JSON.stringify(employees)).toString('hex')}");
$data = json_decode($jsonData, true);

$count = 0;
foreach ($data as $row) {
    if (empty($row['email'])) continue;
    
    try {
        \\Noble\\Hrm\\Models\\Employee::updateOrCreate(
            ['email' => $row['email']],
            [
                'name' => $row['name'] ?? $row['full_name'] ?? 'Unknown',
                'employee_id' => $row['employee_id'] ?? rand(1000, 9999),
                'dob' => $row['dob'] ?? null,
                'gender' => $row['gender'] ?? 'Male',
                'phone' => $row['phone'] ?? null,
                'address' => $row['address'] ?? null,
                'email' => $row['email'],
                'password' => \\Hash::make('1234'),
                'department_id' => 1,
                'designation_id' => 1,
                'company_id' => 1,
                'created_by' => 1,
            ]
        );
        $count++;
    } catch (\\Exception $e) {
        // Skip errors
    }
}
echo "SYNC_SUCCESS:" . $count;
?>`;

    fs.writeFileSync(path.resolve(__dirname, '../public/sync_payload.php'), phpPayload);
    console.log('Payload created in public/sync_payload.php');
}

prepare();
