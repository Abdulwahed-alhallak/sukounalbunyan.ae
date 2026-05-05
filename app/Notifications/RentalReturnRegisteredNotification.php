<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Noble\Rental\Models\RentalReturn;

class RentalReturnRegisteredNotification extends Notification
{
    use Queueable;

    protected $rentalReturn;

    /**
     * Create a new notification instance.
     */
    public function __construct(RentalReturn $rentalReturn)
    {
        $this->rentalReturn = $rentalReturn;
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
            'title' => 'Scaffolding Return Registered',
            'message' => 'Successfully received ' . $this->rentalReturn->returned_quantity . ' units for contract ' . $this->rentalReturn->contract->contract_number,
            'contract_id' => $this->rentalReturn->contract_id,
            'quantity' => $this->rentalReturn->returned_quantity,
            'type' => 'rental_return',
            'action_url' => route('portal.contracts'),
        ];
    }
}
