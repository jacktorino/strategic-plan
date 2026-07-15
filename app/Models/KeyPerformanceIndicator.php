<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KeyPerformanceIndicator extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'key_performance_indicators';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'sub_area_id',
        'code',
        'description',
        'responsible_unit',
        'sort_order',
    ];

    /**
     * Get the action plans associated with this KPI.
     * * This defines the One-to-Many relationship (1 KPI -> Many Action Plans)
     */
    public function actionPlans(): HasMany
    {
        return $this->hasMany(ActionPlan::class, 'kpi_id');
    }
}