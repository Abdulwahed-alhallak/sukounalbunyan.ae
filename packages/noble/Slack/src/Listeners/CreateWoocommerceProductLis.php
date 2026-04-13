<?php

namespace Noble\Slack\Listeners;

use Noble\Slack\Services\SendMsg;
use Noble\WordpressWoocommerce\Events\CreateWoocommerceProduct;

class CreateWoocommerceProductLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateWoocommerceProduct $event)
    {
        $product = $event->wooProduct;

        if (company_setting('Slack New Product') == 'on') {
            $uArr = [
                'name' => $product['name']
            ];

            SendMsg::SendMsgs($uArr, 'New Product');
        }
    }
}