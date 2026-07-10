<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Optional: supporting evidence (exported spreadsheet, photos,
        // certificates) attached to a specific monthly submission.
        Schema::create('monthly_submission_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monthly_submission_id')
                ->constrained('monthly_submissions')
                ->cascadeOnDelete();
            $table->string('original_filename');
            $table->string('path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_submission_attachments');
    }
};
