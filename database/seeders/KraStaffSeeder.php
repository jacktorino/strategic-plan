<?php

namespace Database\Seeders;

use App\Models\KraSubArea;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KraStaffSeeder extends Seeder
{
    /**
     * Creates one staff login per KRA sub-area (e.g. "1.1 Governance" gets
     * its own account, "1.2 Leadership" gets its own account, and so on),
     * so whoever's responsible for that sub-area can log in and submit
     * their monthly percentages.
     *
     * NOTE: the placeholder email domain and default password below are
     * for local/dev use — swap them for your real domain and rotate
     * passwords (or force a reset) before using this against production.
     */
    public function run(): void
    {
        KraSubArea::all()->each(function (KraSubArea $subArea) {
            $slug = Str::slug($subArea->title); // e.g. "governance", "leadership"

            User::updateOrCreate(
                ['kra_sub_area_id' => $subArea->id],
                [
                    'name' => "{$subArea->title}",
                    'email' => "{$slug}@example.test",
                    'password' => 'Testing123!', // hashed automatically via the 'hashed' cast
                    'role' => 'staff',
                    'responsible_unit' => $subArea->title,
                    'status' => User::STATUS_APPROVED,
                    'approved_at' => now(),
                    'email_verified_at' => now(),
                ],
            );
        });
    }
}