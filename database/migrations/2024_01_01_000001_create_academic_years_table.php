<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // e.g. label "AY 2023-2024", start_year 2023, end_year 2024
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('label');           // "AY 2023-2024"
            $table->unsignedSmallInteger('start_year');
            $table->unsignedSmallInteger('end_year');
            $table->boolean('is_current')->default(false);
            $table->timestamps();

            $table->unique(['start_year', 'end_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
