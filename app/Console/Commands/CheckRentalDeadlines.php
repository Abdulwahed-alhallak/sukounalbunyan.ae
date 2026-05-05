<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalInstallment;
use App\Models\User;
use App\Notifications\RentalPaymentDueNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;

class CheckRentalDeadlines extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rental:check-deadlines';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for upcoming rental contract expirations and payment installments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking rental deadlines...');

        // 1. Check for installments due in the next 2 days
        $upcomingInstallments = RentalInstallment::where('due_date', '<=', Carbon::now()->addDays(2))
            ->where('status', 'unpaid')
            ->get();

        foreach ($upcomingInstallments as $installment) {
            $contract = $installment->contract;
            $admin = User::where('type', 'company')->first(); // Notify first company admin for now
            
            if ($admin) {
                $admin->notify(new RentalPaymentDueNotification($contract, $installment));
                $this->line("Notified admin about installment for contract: {$contract->contract_number}");
            }
        }

        // 2. Check for contracts ending soon (if end_date exists)
        // ... (Logic for contract expiration)

        $this->info('Deadline check complete.');
    }
}
