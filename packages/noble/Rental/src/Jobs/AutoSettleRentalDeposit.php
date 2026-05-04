<?php

namespace Noble\Rental\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Noble\Rental\Models\RentalContract;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoSettleRentalDeposit implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $contractId;

    public function __construct($contractId)
    {
        $this->contractId = $contractId;
    }

    public function handle()
    {
        $contract = RentalContract::with('returns')->find($this->contractId);

        if (!$contract) {
            return;
        }

        DB::beginTransaction();
        try {
            // Calculate total damage fees from all returns associated with this contract
            $totalDamageFees = $contract->returns->sum('damage_fee');
            
            // Deduct the damage fee from the security deposit
            $depositAmount = $contract->security_deposit;
            
            $settledAmount = min($totalDamageFees, $depositAmount);
            
            // If damage fee > deposit, the remainder should ideally be invoiced
            $remainingDamageToInvoice = max(0, $totalDamageFees - $depositAmount);

            // Update contract
            $contract->update([
                'total_damage_fees' => $totalDamageFees,
                'deposit_settled_amount' => $settledAmount,
                'invoiced_damage_fees' => $remainingDamageToInvoice,
                'deposit_status' => $totalDamageFees >= $depositAmount ? 'Fully Deducted' : 'Partially Settled',
                'deposit_notes' => "Auto-settled via return assessment. Total damages: {$totalDamageFees}. Settled from deposit: {$settledAmount}."
            ]);

            // Create Journal Entry for the Double Entry system if there's a settled amount
            if ($settledAmount > 0 && class_exists(\Noble\Account\Services\JournalService::class)) {
                $depositAccount = \Noble\Account\Models\ChartOfAccount::where('account_code', '2350')
                    ->where('created_by', $contract->created_by)
                    ->first();
                $revenueAccount = \Noble\Account\Models\ChartOfAccount::where('account_code', '4200')
                    ->where('created_by', $contract->created_by)
                    ->first() ?? \Noble\Account\Models\ChartOfAccount::where('account_code', '4100')
                    ->where('created_by', $contract->created_by)
                    ->first();

                if ($depositAccount && $revenueAccount) {
                    $journalEntry = \Noble\Account\Models\JournalEntry::create([
                        'journal_date' => now(),
                        'entry_type' => 'automatic',
                        'reference_type' => 'rental_deposit_settlement',
                        'reference_id' => $contract->id,
                        'description' => 'Damage Fee Settlement for Contract #' . $contract->contract_number,
                        'total_debit' => $settledAmount,
                        'total_credit' => $settledAmount,
                        'status' => 'posted',
                        'creator_id' => $contract->created_by,
                        'created_by' => $contract->created_by,
                        'workspace' => $contract->workspace,
                    ]);

                    \Noble\Account\Models\JournalEntryItem::create([
                        'journal_entry_id' => $journalEntry->id,
                        'account_id' => $depositAccount->id,
                        'description' => 'Deposit deducted for damages',
                        'debit_amount' => $settledAmount,
                        'credit_amount' => 0,
                        'creator_id' => $contract->created_by,
                        'created_by' => $contract->created_by,
                        'workspace' => $contract->workspace,
                    ]);

                    \Noble\Account\Models\JournalEntryItem::create([
                        'journal_entry_id' => $journalEntry->id,
                        'account_id' => $revenueAccount->id,
                        'description' => 'Damage fee revenue',
                        'debit_amount' => 0,
                        'credit_amount' => $settledAmount,
                        'creator_id' => $contract->created_by,
                        'created_by' => $contract->created_by,
                        'workspace' => $contract->workspace,
                    ]);

                    // Update balances
                    $depositAccount->current_balance -= $settledAmount; // Liability decreasing is debit, but normal balance is credit, so subtract
                    $depositAccount->save();

                    $revenueAccount->current_balance += $settledAmount; // Revenue increasing is credit, normal balance is credit, so add
                    $revenueAccount->save();
                }
            }
            
            DB::commit();
            Log::info("Auto-settled deposit for rental contract {$contract->contract_number}. Damage: {$totalDamageFees}");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to auto-settle deposit for contract {$this->contractId}: " . $e->getMessage());
        }
    }
}
