<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Third level: "1.1.1 Deployment and dissemination of VMO...",
        // "2.3.5 Non-Teaching personnel should borrow..." etc.
        // This is the row that actually gets tracked/measured over time.
        Schema::create('key_performance_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_area_id')->constrained('kra_sub_areas')->cascadeOnDelete();
            $table->string('code')->unique(); // "1.1.1", "2.3.5"
            $table->text('description');       // full KPI statement
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('key_performance_indicators');
    }
};
