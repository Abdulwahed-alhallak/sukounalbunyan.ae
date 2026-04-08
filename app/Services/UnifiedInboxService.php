<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;

class UnifiedInboxService
{
    protected $companyId;
    protected $settings;

    public function __construct($companyId)
    {
        $this->companyId = $companyId;
        $this->settings = getCompanyAllSetting($companyId);
    }

    /**
     * Fetch combined messages from all integrated channels.
     * In a production environment, this would poll IMAP and Twilio via webhooks
     * and store them locally for faster rendering.
     * Here it serves as the aggregation proxy.
     */
    public function fetchAllMessages($limit = 50)
    {
        $messages = [];

        // 1. Fetch Internal CRM Messages (Mocked/Aggregated)
        // If internal chat module exists
        $messages = array_merge($messages, $this->getInternalMessages($limit));

        // 2. Fetch WhatsApp Messages (Twilio Conversations API or Webhook logs)
        if ($this->hasTwilioConfigured()) {
            $messages = array_merge($messages, $this->getWhatsAppMessages($limit));
        }

        // 3. Fetch Email Messages (IMAP via Webklex)
        if ($this->hasImapConfigured()) {
            $messages = array_merge($messages, $this->getEmailMessages($limit));
        }

        // Sort by timestamp descending
        usort($messages, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        return array_slice($messages, 0, $limit);
    }

    /**
     * Send a message through a specific channel.
     */
    public function sendMessage($platform, $to, $content, $attachments = [])
    {
        switch ($platform) {
            case 'whatsapp':
                return $this->sendWhatsAppMessage($to, $content);
            case 'email':
                return $this->sendEmailMessage($to, $content, $attachments);
            case 'internal':
                return $this->sendInternalMessage($to, $content);
            default:
                throw new Exception("Unsupported omnichannel platform: {$platform}");
        }
    }

    private function hasTwilioConfigured(): bool
    {
        return !empty($this->settings['twilio_sid']) && !empty($this->settings['twilio_auth_token']);
    }

    private function hasImapConfigured(): bool
    {
        return !empty($this->settings['imap_host']) && !empty($this->settings['imap_username']);
    }

    /**
     * Send WhatsApp Message via Twilio SDK.
     */
    private function sendWhatsAppMessage($to, $content)
    {
        if (!class_exists(\Twilio\Rest\Client::class)) {
            Log::error('Twilio SDK not installed for WhatsApp.');
            return false;
        }

        $sid = $this->settings['twilio_sid'] ?? env('TWILIO_SID');
        $token = $this->settings['twilio_auth_token'] ?? env('TWILIO_AUTH_TOKEN');
        $from = $this->settings['twilio_whatsapp_from'] ?? env('TWILIO_WHATSAPP_FROM');

        try {
            $twilio = new \Twilio\Rest\Client($sid, $token);
            $message = $twilio->messages->create(
                "whatsapp:" . $to,
                [
                    "from" => "whatsapp:" . $from,
                    "body" => $content
                ]
            );
            return $message->sid;
        } catch (Exception $e) {
            Log::error("Twilio WhatsApp Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send System Email via standard Laravel Mailer configured dynamically
     */
    private function sendEmailMessage($to, $content, $attachments)
    {
        // Integration with standard App\Mail system or SwiftMailer config
        Log::info("Unified Inbox sending Email to: {$to}");
        return true; // Placeholder for email send
    }

    private function sendInternalMessage($to, $content)
    {
        Log::info("Unified Inbox sending Internal message to User: {$to}");
        return true;
    }

    // --- Data Fetching Methods (Stubs that would query local DB or APIs) ---

    private function getInternalMessages($limit) { return []; }
    private function getWhatsAppMessages($limit) { return []; }
    private function getEmailMessages($limit) { return []; }
}
