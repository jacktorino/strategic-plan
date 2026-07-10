<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Responsible units from the "RESPONSIBLE UNIT" column, e.g. CPAD, FAD,
        // ICTD, HRD, individual colleges (CAS, CBA, COED...), Academic/Non-Academic
        // Units generically, etc.
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();  // "CPAD", "FAD", "ICTD", "CAS"...
            $table->string('name');
            $table->enum('type', ['academic', 'non_academic'])->default('non_academic');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
