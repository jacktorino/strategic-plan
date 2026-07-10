<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Second level: "1.1 Governance", "1.2 Leadership", etc.
        // This is what the sidebar's Key Result Areas menu links to
        // (/reports/kras/{code}).
        Schema::create('kra_sub_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kra_id')->constrained('key_result_areas')->cascadeOnDelete();
            $table->string('code')->unique(); // "1.1", "1.2", "5.8"
            $table->string('title');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kra_sub_areas');
    }
};
