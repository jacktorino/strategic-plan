<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
   public function kpis(): BelongsToMany
{
    return $this->belongsToMany(Kpi::class, 'kpi_unit', 'unit_id', 'kpi_id');
}

public function actionPlans(): BelongsToMany
{
    return $this->belongsToMany(ActionPlan::class, 'action_plan_unit', 'unit_id', 'action_plan_id');
}

public function monthlySubmissions(): HasMany
{
    return $this->hasMany(MonthlySubmission::class);
}
}
