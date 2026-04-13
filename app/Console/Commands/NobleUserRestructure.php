<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class NobleUserRestructure extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'noble:restructure-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely deletes test companies, injects Noble Master Accounts, and migrates real employees under Noble.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting Noble Architecture User Restructure Sequence...');
        
        DB::beginTransaction();
        try {
            // STEP 1: CREATE OR VERIFY SUPERADMIN
            $superAdmin = User::firstOrCreate(
                ['email' => 'superadmin@noblearchitecture.net'],
                [
                    'name' => 'Super Admin',
                    'email_verified_at' => now(),
                    'password' => Hash::make('1234'),
                    'type' => 'superadmin',
                    'lang' => 'en',
                    'total_user' => -1,
                    'creator_id' => null,
                    'created_by' => null
                ]
            );
            if (!$superAdmin->hasRole('superadmin')) {
                $superAdmin->assignRole('superadmin');
            }
            $this->info('✅ Super Admin verified: superadmin@noblearchitecture.net');

            // STEP 2: CREATE OR VERIFY MASTER COMPANY (Noble Architecture)
            $masterCompany = User::firstOrCreate(
                ['email' => 'admin@noblearchitecture.net'],
                [
                    'name' => 'Noble Architecture',
                    'email_verified_at' => now(),
                    'password' => Hash::make('1234'),
                    'mobile_no' => '1234567890',
                    'type' => 'company',
                    'lang' => 'en',
                    'creator_id' => $superAdmin->id,
                    'created_by' => $superAdmin->id
                ]
            );
            if (!$masterCompany->hasRole('company')) {
                $masterCompany->assignRole('company');
                User::MakeRole($masterCompany->id);
            }
            $this->info('✅ Master Company verified: Noble Architecture (admin@noblearchitecture.net)');

            // STEP 3: MIGRATE DOMAINS (noble.sy -> noblearchitecture.net)
            $usersWithOldDomain = User::where('email', 'like', '%@noble.sy')->get();
            foreach ($usersWithOldDomain as $user) {
                $newEmail = str_replace('@noble.sy', '@noblearchitecture.net', $user->email);
                
                // Ensure no conflict before updating
                if (!User::where('email', $newEmail)->exists()) {
                    $user->email = $newEmail;
                    $user->save();
                    $this->line("   -> Updated domain: {$newEmail}");
                }
            }
            $this->info('✅ Global Email Domains Mapped to @noblearchitecture.net');

            // STEP 4: IDENTIFY & PROTECT REAL EMPLOYEES AND MOVE TO MASTER COMPANY
            // Real employees are those who are NOT of type 'company' and NOT 'superadmin' 
            // AND they are not the new master ones.
            $realEmployees = User::whereNotIn('type', ['company', 'superadmin'])->get();
            $employeeCount = 0;
            foreach ($realEmployees as $emp) {
                $emp->created_by = $masterCompany->id;
                $emp->creator_id = $masterCompany->id;
                
                // If there's a workspace field to map, we update it here if applicable.
                if (\Schema::hasColumn('users', 'workspace_id')) {
                    // Assuming Workspace mapping if it exists in your schema
                    $activeWorkspace = \App\Models\Workspace::where('created_by', $masterCompany->id)->first();
                    if ($activeWorkspace) {
                        $emp->workspace_id = $activeWorkspace->id;
                    }
                }

                $emp->save();
                $employeeCount++;
            }
            $this->info("✅ Safely mapped {$employeeCount} real employees to Noble Architecture.");

            // STEP 5: PRUNE DEMO COMPANIES
            // We want to delete every user of type 'company' EXCEPT our master Company.
            $demoCompanies = User::where('type', 'company')
                                ->where('id', '!=', $masterCompany->id)
                                ->get();
                                
            $prunedCount = 0;
            foreach ($demoCompanies as $demoCompany) {
                // Delete associated roles, workspaces, or cascades if setup, but usually eloquent events or cascade handles it.
                // We physically delete the company record.
                $demoCompany->delete();
                $prunedCount++;
            }
            $this->info("🧹 Pruned {$prunedCount} testing/demo companies.");

            DB::commit();
            $this->info('🎉 Data Restructure Completed Successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Failed: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
