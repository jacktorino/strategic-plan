<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kra extends Model
{
    protected $table = 'key_result_areas';

    protected $fillable = ['number', 'title', 'reference'];

    public function subAreas(): HasMany
    {
        return $this->hasMany(KraSubArea::class, 'kra_id');
    }
}