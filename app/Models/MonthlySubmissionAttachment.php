<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonthlySubmissionAttachment extends Model
{
    protected $fillable = [
        'monthly_submission_id', 'original_filename', 'path', 'mime_type', 'size_bytes',
    ];

    public function monthlySubmission(): BelongsTo
    {
        return $this->belongsTo(MonthlySubmission::class);
    }
}