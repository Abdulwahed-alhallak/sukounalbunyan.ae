<?php

namespace Noble\Lead\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Noble\ProductService\Models\ProductServiceItem;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia as SpatieInteractsWithMedia;
use Noble\Taskly\Traits\InteractsWithMedia;

class Lead extends Model
{
    use HasFactory, SpatieInteractsWithMedia, InteractsWithMedia;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'user_id',
        'pipeline_id',
        'stage_id',
        'sources',
        'products',
        'notes',
        'labels',
        'order',
        'phone',
        'is_active',
        'is_converted',
        'date',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'pipeline_id' => 'integer',
            'stage_id' => 'integer',
            'is_active' => 'boolean',
            'date' => 'date',
            'creator_id' => 'integer'
        ];
    }

    public function stage()
    {
        return $this->belongsTo(LeadStage::class, 'stage_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function userLeads()
    {
        return $this->hasMany(UserLead::class, 'lead_id');
    }

    public function tasks()
    {
        return $this->hasMany(LeadTask::class, 'lead_id');
    }

    public function complete_tasks()
    {
        return $this->hasMany(LeadTask::class, 'lead_id')->where('status', '=', 'Complete');
    }

    public function emails()
    {
        return $this->hasMany(LeadEmail::class, 'lead_id');
    }

    public function discussions()
    {
        return $this->hasMany(LeadDiscussion::class, 'lead_id');
    }

    public function files()
    {
        return $this->hasMany(LeadFile::class, 'lead_id');
    }

    public function calls()
    {
        return $this->hasMany(LeadCall::class, 'lead_id');
    }

    public function activities()
    {
        return $this->hasMany('Noble\Lead\Models\LeadActivityLog', 'lead_id', 'id')->orderBy('id', 'desc');
    }

    public function pipeline()
    {
        return $this->belongsTo('Noble\Lead\Models\Pipeline', 'pipeline_id');
    }

    public function sources()
    {
        return $this->belongsTo(Source::class, 'sources');
    }

    public function products()
    {
        return $this->belongsTo(ProductServiceItem::class, 'products');
    }

}