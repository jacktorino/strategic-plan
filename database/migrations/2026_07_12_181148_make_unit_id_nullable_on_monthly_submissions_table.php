<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('monthly_submissions', function (Blueprint $table) {
        if (! Schema::hasColumn('monthly_submissions', 'action_plan_id')) {
            $table->unsignedBigInteger('action_plan_id')->nullable()->after('kpi_id');
        }
    });
}

    public function down(): void
    {
        Schema::table('monthly_submissions', function (Blueprint $table) {
            $table->unsignedBigInteger('unit_id')->nullable(false)->change();
        });
    }
};