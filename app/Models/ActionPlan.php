<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ActionPlan extends Model
{
    protected $fillable = ['kpi_id', 'description', 'sort_order'];

    public function kpi(): BelongsTo
    {
        return $this->belongsTo(Kpi::class, 'kpi_id');
    }

    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'action_plan_unit', 'action_plan_id', 'unit_id');
    }
}