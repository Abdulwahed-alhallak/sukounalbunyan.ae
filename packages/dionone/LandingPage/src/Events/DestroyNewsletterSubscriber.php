<?php

namespace DionONE\LandingPage\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\LandingPage\Models\NewsletterSubscriber;

class DestroyNewsletterSubscriber
{
    use Dispatchable;

    public function __construct(
        public NewsletterSubscriber $subscriber,
    ) {}
}