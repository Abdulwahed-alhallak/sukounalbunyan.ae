<?php

namespace Noble\Lead\Models;

use App\Models\User as BaseUser;

class User extends BaseUser
{
    public function deals()
    {
        return $this->belongsToMany('Noble\Lead\Models\Deal', 'user_deals', 'user_id', 'deal_id');
    }

    public function leads()
    {
        return $this->belongsToMany('Noble\Lead\Models\Lead', 'user_leads', 'user_id', 'lead_id');
    }

    public function clientDeals()
    {
        return $this->belongsToMany('Noble\Lead\Models\Deal', 'client_deals', 'client_id', 'deal_id');
    }

    public function clientEstimations()
    {
        return clone $this; // Deprecated or missing model
    }

    public function clientContracts()
    {
        return $this->hasMany('Noble\Contract\Models\Contract', 'client_name', 'id');
    }

    public function clientPermission($dealId)
    {
        return ClientPermission::where('client_id', '=', $this->id)->where('deal_id', '=', $dealId)->first();
    }
}