<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A KPI is often owned by more than one unit at once, e.g.
        // "CPAD / QMS / FMD" or "ICTD / FAD / Academic Units". Many-to-many.
        Schema::create('kpi_unit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')->constrained('key_performance_indicators')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['kpi_id', 'unit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_unit');
    }
};
