<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Links a staff account to the KRA sub-area they're responsible for
     * (e.g. "1.1 Governance", "1.2 Leadership"). Null for admin/president
     * accounts, which aren't scoped to a single sub-area.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('kra_sub_area_id')
                ->nullable()
                ->after('responsible_unit')
                ->constrained('kra_sub_areas')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kra_sub_area_id');
        });
    }
};