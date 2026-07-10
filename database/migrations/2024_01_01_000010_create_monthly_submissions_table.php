<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The core change: instead of one percentage per KPI per academic
        // year, a responsible unit submits a percentage-achieved figure
        // every month. This is what the header's Year -> Month picker
        // (/reports/monthly?year=&month=) reads from, and what the
        // sidebar's /reports/kras/{code} pages aggregate/roll up.
        Schema::create('monthly_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kpi_id')->constrained('key_performance_indicators')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();

            $table->unsignedSmallInteger('year');          // calendar year of the submission, e.g. 2026
            $table->unsignedTinyInteger('month');           // 1-12
            $table->decimal('percentage_achieved', 5, 2);   // 0.00–100.00
            $table->text('remarks')->nullable();

            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected'])
                ->default('draft');

            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();

            // One submission per KPI, per unit, per calendar month.
            $table->unique(['kpi_id', 'unit_id', 'year', 'month'], 'monthly_submissions_unique');
            $table->index(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_submissions');
    }
};
