<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpi_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')->constrained('kpis')->onDelete('cascade');
            // Tracking the active academic year (e.g., "2026-2027")
            $table->string('academic_year');
            // The operational monitoring month (e.g., "July", "August")
            $table->string('submission_month');
            // Compliance metric value stored as an integer percentage (e.g., 85 for 85%)
            $table->integer('compliance_percentage')->default(0);
            $table->text('remarks')->nullable(); // Brief operational explanation/evidence notes
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_submissions');
    }
};