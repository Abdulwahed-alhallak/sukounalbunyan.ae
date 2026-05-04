<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

use Illuminate\Support\Facades\Schedule;
use Noble\Rental\Jobs\ProcessDailyRentalBilling;
use Noble\Rental\Jobs\ProcessRentalInstallments;

Schedule::job(new ProcessDailyRentalBilling)->dailyAt('00:00');
Schedule::job(new ProcessRentalInstallments)->dailyAt('00:00');
