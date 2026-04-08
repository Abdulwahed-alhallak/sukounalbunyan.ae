<?php

namespace DionONE\Lead\Models;

use App\Models\User as BaseUser;

class User extends BaseUser
{
    public function deals()
    {
        return $this->belongsToMany('DionONE\Lead\Models\Deal', 'user_deals', 'user_id', 'deal_id');
    }

    public function leads()
    {
        return $this->belongsToMany('DionONE\Lead\Models\Lead', 'user_leads', 'user_id', 'lead_id');
    }

    public function clientDeals()
    {
        return $this->belongsToMany('DionONE\Lead\Models\Deal', 'client_deals', 'client_id', 'deal_id');
    }

    public function clientEstimations()
    {
        return $this->hasMany('DionONE\Lead\Models\Estimation', 'client_id', 'id');
    }

    public function clientContracts()
    {
        return $this->hasMany('DionONE\Lead\Models\Contract', 'client_name', 'id');
    }

    public function clientPermission($dealId)
    {
        return ClientPermission::where('client_id', '=', $this->id)->where('deal_id', '=', $dealId)->first();
    }
}