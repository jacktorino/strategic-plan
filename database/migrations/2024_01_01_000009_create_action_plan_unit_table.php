<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Some action plans list their own responsible unit that differs
        // from (or narrows down) the parent KPI's units, e.g. under 1.7.1
        // one action plan is "FAD" alone, another is "FAD / ICTD".
        Schema::create('action_plan_unit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('action_plan_id')->constrained('action_plans')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['action_plan_id', 'unit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('action_plan_unit');
    }
};
