<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kpis', function (Blueprint $table) {
            $table->id();
            // 🌟 Links each KPI record to its parent KRA row
            $table->foreignId('kra_id')->constrained('kras')->onDelete('cascade');
            $table->string('code'); 
            $table->text('name'); // This holds your KPI target measurement text description
            $table->string('target_2024')->default('100%');
            $table->string('target_2025')->default('100%');
            $table->string('target_2026')->default('100%');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function border(): void
    {
        Schema::dropIfExists('kpis');
    }
};