// database/migrations/xxxx_xx_xx_add_unit_code_to_kpi_submissions_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kpi_submissions', function (Blueprint $table) {
            $table->string('unit_code')->nullable()->after('kpi_id');
        });
    }

    public function down(): void
    {
        Schema::table('kpi_submissions', function (Blueprint $table) {
            $table->dropColumn('unit_code');
        });
    }
};