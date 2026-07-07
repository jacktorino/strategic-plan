<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 🌟 Each Innovative Action Plan row now carries its own list of
        // responsible units (specific unit codes and/or whole-group markers
        // like "All Academic Units"), stored as JSON.
        Schema::table('innovative_action_plans', function (Blueprint $table) {
            $table->json('responsible_units')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('innovative_action_plans', function (Blueprint $table) {
            $table->dropColumn('responsible_units');
        });
    }
};