<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicYear extends Model
{
    protected $fillable = ['label', 'start_year', 'end_year', 'is_current'];

    protected $casts = ['is_current' => 'boolean'];

    public function kpiTargets(): HasMany
    {
        return $this->hasMany(KpiTarget::class);
    }

    public function monthlySubmissions(): HasMany
    {
        return $this->hasMany(MonthlySubmission::class);
    }
}