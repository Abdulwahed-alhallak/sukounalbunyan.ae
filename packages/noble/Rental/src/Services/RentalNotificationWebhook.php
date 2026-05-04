<?php

namespace Noble\Rental\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RentalNotificationWebhook
{
    /**
     * Send a notification payload to N8N Webhook URL.
     * 
     * @param string $event "invoice_generated" | "contract_overdue" | "item_returned"
     * @param array $payload Data payload containing customer and rental info
     */
    public static function trigger(string $event, array $payload)
    {
        $webhookUrl = env('N8N_WEBHOOK_URL');

        if (!$webhookUrl) {
            Log::warning("N8N_WEBHOOK_URL is not set. Skipping N8N webhook trigger for event: {$event}");
            return;
        }

        try {
            $response = Http::timeout(10)->post($webhookUrl, [
                'event' => $event,
                'timestamp' => now()->toIso8601String(),
                'payload' => $payload,
                'source' => 'sukoun_albunyan_rental_module'
            ]);

            if ($response->successful()) {
                Log::info("Successfully triggered N8N webhook for event: {$event}");
            } else {
                Log::error("Failed to trigger N8N webhook for event {$event}. Status: " . $response->status());
            }
        } catch (\Exception $e) {
            Log::error("Exception triggering N8N webhook: " . $e->getMessage());
        }
    }
}
