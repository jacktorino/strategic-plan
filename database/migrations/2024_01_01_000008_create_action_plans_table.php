<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // "INNOVATIVE ACTION PLAN" column. A KPI can have several action
        // plans (e.g. 1.1.4 has three separate bullet actions).
        Schema::create('action_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')->constrained('key_performance_indicators')->cascadeOnDelete();
            $table->text('description');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('action_plans');
    }
};
