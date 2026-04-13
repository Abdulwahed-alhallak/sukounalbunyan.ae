<?php

namespace Noble\LandingPage\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\LandingPage\Models\NewsletterSubscriber;

class DestroyNewsletterSubscriber
{
    use Dispatchable;

    public function __construct(
        public NewsletterSubscriber $subscriber,
    ) {}
}