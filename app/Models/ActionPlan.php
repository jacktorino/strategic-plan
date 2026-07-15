<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ActionPlan extends Model
{
    // 1. Fillable attributes perfectly match your DB columns!
    protected $fillable = ['kpi_id', 'description', 'sort_order'];

    /**
     * Get the KPI that owns this action plan.
     */
    public function kpi(): BelongsTo
    {
        // Point this to the correct model name: KeyPerformanceIndicator
        return $this->belongsTo(KeyPerformanceIndicator::class, 'kpi_id');
    }

    /**
     * Get the units associated with this action plan.
     */
    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'action_plan_unit', 'action_plan_id', 'unit_id');
    }
}