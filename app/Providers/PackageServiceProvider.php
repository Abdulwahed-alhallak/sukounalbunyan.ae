<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class PackageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $loader = require base_path('vendor/autoload.php');

        // Robust manifest-driven discovery for the 28 Noble Architecture Enterprise Suites
        $noblePackages = [
            'AIAssistant' => 'Noble\AIAssistant\Providers\AIAssistantServiceProvider',
            'Account' => 'Noble\Account\Providers\AccountServiceProvider',
            'BudgetPlanner' => 'Noble\BudgetPlanner\Providers\BudgetPlannerServiceProvider',
            'Calendar' => 'Noble\Calendar\Providers\CalendarServiceProvider',
            'Contract' => 'Noble\Contract\Providers\ContractServiceProvider',
            'DoubleEntry' => 'Noble\DoubleEntry\Providers\DoubleEntryServiceProvider',
            'FormBuilder' => 'Noble\FormBuilder\Providers\FormBuilderServiceProvider',
            'Goal' => 'Noble\Goal\Providers\GoalServiceProvider',
            'GoogleCaptcha' => 'Noble\GoogleCaptcha\Providers\GoogleCaptchaServiceProvider',
            'Hrm' => 'Noble\Hrm\Providers\HrmServiceProvider',
            'LandingPage' => 'Noble\LandingPage\Providers\LandingPageServiceProvider',
            'Lead' => 'Noble\Lead\Providers\LeadServiceProvider',
            'Paypal' => 'Noble\Paypal\Providers\PaypalServiceProvider',
            'Performance' => 'Noble\Performance\Providers\PerformanceServiceProvider',
            'Pos' => 'Noble\Pos\Providers\PosServiceProvider',
            'ProductService' => 'Noble\ProductService\Providers\ProductServiceServiceProvider',
            'Quotation' => 'Noble\Quotation\Providers\QuotationServiceProvider',
            'Recruitment' => 'Noble\Recruitment\Providers\RecruitmentServiceProvider',
            'Slack' => 'Noble\Slack\Providers\SlackServiceProvider',
            'Stripe' => 'Noble\Stripe\Providers\StripeServiceProvider',
            'SupportTicket' => 'Noble\SupportTicket\Providers\SupportTicketServiceProvider',
            'Taskly' => 'Noble\Taskly\Providers\TasklyServiceProvider',
            'Telegram' => 'Noble\Telegram\Providers\TelegramServiceProvider',
            'Timesheet' => 'Noble\Timesheet\Providers\TimesheetServiceProvider',
            'Training' => 'Noble\Training\Providers\TrainingServiceProvider',
            'Twilio' => 'Noble\Twilio\Providers\TwilioServiceProvider',
            'Webhook' => 'Noble\Webhook\Providers\WebhookServiceProvider',
            'ZoomMeeting' => 'Noble\ZoomMeeting\Providers\ZoomMeetingServiceProvider',
        ];

        foreach ($noblePackages as $folder => $provider) {
            $packageDir = base_path('packages/noble/' . $folder);
            $composerFile = $packageDir . '/composer.json';

            if (file_exists($composerFile)) {
                $composerConfig = json_decode(file_get_contents($composerFile), true);

                // Register PSR-4 Namespace for the package
                if (isset($composerConfig['autoload']['psr-4'])) {
                    foreach ($composerConfig['autoload']['psr-4'] as $namespace => $path) {
                        $loader->addPsr4($namespace, $packageDir . '/' . trim($path, '/'));
                    }
                }

                // Explicitly register the provider if it exists
                if (class_exists($provider)) {
                    $this->app->register($provider);
                }
            }
        }
    }

    public function boot(): void
    {
        //
    }
}
