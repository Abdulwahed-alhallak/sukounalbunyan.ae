<?php

namespace App\Console\Commands;

use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class CheckSubscriptionExpiry extends Command
{
    protected $signature = 'subscriptions:check-expiry';
    protected $description = 'Check for expiring/expired subscriptions and send notifications';

    public function handle(): int
    {
        $count = SubscriptionService::checkExpiringSubscriptions();
        $this->info("Processed {$count} subscription notification(s).");
        return 0;
    }
}
