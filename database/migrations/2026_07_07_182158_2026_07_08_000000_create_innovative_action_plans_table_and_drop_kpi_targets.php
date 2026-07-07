<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 🌟 One KPI can now have many Innovative Action Plan entries.
        Schema::create('innovative_action_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')
                ->constrained('kpis')
                ->cascadeOnDelete();
            $table->text('description');
            $table->timestamps();
        });

        // 🌟 Per-year targets are no longer manually entered — they're
        // computed from kpi_submissions instead, so these columns are
        // no longer needed.
        Schema::table('kpis', function (Blueprint $table) {
            $table->dropColumn([
                'target_2024',
                'target_2025',
                'target_2026',
                'target_2027',
                'target_2028',
                'target_2029',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('kpis', function (Blueprint $table) {
            $table->string('target_2024')->default('100%');
            $table->string('target_2025')->default('100%');
            $table->string('target_2026')->default('100%');
            $table->string('target_2027')->default('100%');
            $table->string('target_2028')->default('100%');
            $table->string('target_2029')->default('100%');
        });

        Schema::dropIfExists('innovative_action_plans');
    }
};