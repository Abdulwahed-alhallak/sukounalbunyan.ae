<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RentalPaymentDueNotification extends Notification
{
    use Queueable;

    protected $contract;
    protected $installment;

    /**
     * Create a new notification instance.
     */
    public function __construct($contract, $installment = null)
    {
        $this->contract = $contract;
        $this->installment = $installment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Rental Payment Due',
            'message' => 'Upcoming payment for ' . $this->contract->customer->name . ' (Contract ' . $this->contract->contract_number . ')',
            'contract_id' => $this->contract->id,
            'customer_name' => $this->contract->customer->name,
            'type' => 'payment_alert',
            'action_url' => route('rental.index'),
        ];
    }
}
