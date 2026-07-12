<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A KPI can have several action plans, each reported on separately
        // by the same unit in the same month (e.g. two targets under one
        // KRA sub-area). Without this column, updateOrCreate() in
        // UnitKpiController::storeSubmission() would collide on
        // (kpi_id, unit_id, year, month) and silently overwrite one action
        // plan's percentage with another's.
        Schema::table('monthly_submissions', function (Blueprint $table) {
            $table->foreignId('action_plan_id')
                ->nullable()
                ->after('kpi_id')
                ->constrained('action_plans') // adjust if your action plans table is named differently
                ->nullOnDelete();
        });

        Schema::table('monthly_submissions', function (Blueprint $table) {
            $table->dropUnique('monthly_submissions_unique');
            $table->unique(
                ['kpi_id', 'unit_id', 'academic_year_id', 'month', 'action_plan_id'],
                'monthly_submissions_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('monthly_submissions', function (Blueprint $table) {
            $table->dropUnique('monthly_submissions_unique');
        });

        Schema::table('monthly_submissions', function (Blueprint $table) {
            $table->unique(['kpi_id', 'unit_id', 'year', 'month'], 'monthly_submissions_unique');
            $table->dropConstrainedForeignId('action_plan_id');
        });
    }
};