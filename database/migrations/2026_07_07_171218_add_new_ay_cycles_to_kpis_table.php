<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kpis', function (Blueprint $table) {
            // Adding the next 3-year cycle columns safely
            $table->string('target_2027')->default('100%')->after('target_2026');
            $table->string('target_2028')->default('100%')->after('target_2027');
            $table->string('target_2029')->default('100%')->after('target_2028');
        });
    }

    public function down(): void
    {
        Schema::table('kpis', function (Blueprint $table) {
            $table->dropColumn(['target_2027', 'target_2028', 'target_2029']);
        });
    }
};