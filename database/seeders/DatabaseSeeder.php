<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a President User
        User::factory()->create([
            'name' => 'UV President',
            'email' => 'president@uv.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'president',
            'responsible_unit' => null,
        ]);

        // 2. Create an Admin User
        User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@uv.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'responsible_unit' => 'Management Information System',
        ]);

        // 3. Create a Staff / Unit User
        User::factory()->create([
            'name' => 'HR Department Head',
            'email' => 'hr@uv.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'responsible_unit' => 'Human Resources',
        ]);
    }
}