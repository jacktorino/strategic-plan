<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Top level: "KRA 1: EFFICIENT AND EFFECTIVE GOVERNANCE..."
        Schema::create('key_result_areas', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('number')->unique(); // 1, 2, 3, 4, 5
            $table->string('title');
            $table->string('reference')->nullable(); // "Mission #4 and QO #4"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('key_result_areas');
    }
};
