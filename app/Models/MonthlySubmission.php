<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MonthlySubmission extends Model
{
    protected $fillable = [
        'kpi_id', 'action_plan_id', 'unit_id', 'academic_year_id',
        'year', 'month', 'percentage_achieved', 'remarks',
        'status', 'submitted_by', 'submitted_at', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'percentage_achieved' => 'decimal:2',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(Kpi::class, 'kpi_id');
    }

    public function actionPlan(): BelongsTo
    {
        return $this->belongsTo(ActionPlan::class, 'action_plan_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(MonthlySubmissionAttachment::class);
    }
}