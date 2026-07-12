<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KraSubArea extends Model
{
    protected $fillable = ['kra_id', 'code', 'title', 'sort_order'];

    public function kra(): BelongsTo
    {
        return $this->belongsTo(Kra::class, 'kra_id');
    }

    public function kpis(): HasMany
    {
        return $this->hasMany(Kpi::class, 'sub_area_id')->orderBy('sort_order');
    }
}