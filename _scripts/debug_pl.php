<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$request = \Illuminate\Http\Request::create('/reports/profit_loss', 'GET');
$user = \App\Models\User::where('email', 'admin@noble.com')->first();
$app->make('auth')->login($user);
$response = $kernel->handle($request);
if ($response->exception) {
    echo "Exception Class: " . get_class($response->exception) . "\n";
    echo "Message: " . $response->exception->getMessage() . "\n";
    echo "File: " . $response->exception->getFile() . ":" . $response->exception->getLine() . "\n";
} else {
    echo "Status: " . $response->getStatusCode() . "\n";
    if ($response->getStatusCode() == 500) {
        $content = $response->getContent();
        if (preg_match('/<title>(.*?)<\/title>/', $content, $matches)) {
            echo "Title: " . $matches[1] . "\n";
        }
        echo "No explicit exception binding but returned 500 error.\n";
    }
}
$kernel->terminate($request, $response);
