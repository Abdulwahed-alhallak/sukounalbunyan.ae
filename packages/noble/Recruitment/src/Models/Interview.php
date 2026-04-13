<?php

namespace Noble\Recruitment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Noble\Recruitment\Models\Candidate;
use Noble\Recruitment\Models\JobPosting;
use Noble\Recruitment\Models\InterviewRound;
use Noble\Recruitment\Models\InterviewType;
use Noble\Recruitment\Models\InterviewFeedback;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'scheduled_date',
        'scheduled_time',
        'duration',
        'location',
        'meeting_link',
        'interviewers',
        'interviewer_ids',
        'status',
        'feedback_submitted',
        'candidate_id',
        'job_id',
        'round_id',
        'interview_type_id',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
            'feedback_submitted' => 'boolean',
            'interviewer_ids' => 'array'
        ];
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class, 'job_id');
    }

    public function interviewRound()
    {
        return $this->belongsTo(InterviewRound::class, 'round_id');
    }

    public function interviewType()
    {
        return $this->belongsTo(InterviewType::class, 'interview_type_id');
    }

    public function interviewFeedbacks()
    {
        return $this->hasMany(InterviewFeedback::class, 'interview_id', 'id');
    }
}