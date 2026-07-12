<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Kpi extends Model
{
    protected $table = 'key_performance_indicators';

    protected $fillable = ['sub_area_id', 'code', 'description', 'sort_order'];

    public function subArea(): BelongsTo
    {
        return $this->belongsTo(KraSubArea::class, 'sub_area_id');
    }

    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'kpi_unit', 'kpi_id', 'unit_id');
    }

    public function targets(): HasMany
    {
        return $this->hasMany(KpiTarget::class, 'kpi_id');
    }

    public function actionPlans(): HasMany
    {
        return $this->hasMany(ActionPlan::class, 'kpi_id')->orderBy('sort_order');
    }

    public function monthlySubmissions(): HasMany
    {
        return $this->hasMany(MonthlySubmission::class, 'kpi_id');
    }
}