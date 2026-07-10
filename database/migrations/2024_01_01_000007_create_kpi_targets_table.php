<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Replaces the sheet's "AY 2023-2024 / AY 2024-2025 / AY 2025-2026"
        // columns. Each row is the TARGET percentage for one KPI in one
        // academic year (e.g. 100%, or 20% -> 50% -> 100% ramp-ups like 2.1.4).
        // Actual progress is now tracked monthly in monthly_submissions,
        // and compared against this target.
        Schema::create('kpi_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')->constrained('key_performance_indicators')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->decimal('target_percentage', 5, 2); // 0.00–100.00
            $table->timestamps();

            $table->unique(['kpi_id', 'academic_year_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_targets');
    }
};
