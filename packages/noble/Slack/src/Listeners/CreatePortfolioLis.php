<?php

namespace Noble\Slack\Listeners;

use Noble\Portfolio\Events\CreatePortfolio;
use Noble\Portfolio\Models\PortfolioCategory;
use Noble\Slack\Services\SendMsg;

class CreatePortfolioLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreatePortfolio $event)
    {
        $portfolio = $event->portfolio;
        $category =  PortfolioCategory::find($portfolio->category);

        if (company_setting('Slack New Portfolio') == 'on') {
            $uArr = [
                'prortfolio_name' => $portfolio->title,
                'portfolio_category' => $category->title,
            ];

            SendMsg::SendMsgs($uArr, 'New Portfolio');
        }
    }
}
