<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResponsibleUnitUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $responsibleUnitGroups = [
            'Academic Units' => [
                'CAHS', 'CAS', 'CBA', 'CCJE', 'COED', 'CETA', 'COME', 'GLS',
            ],
            'Academic Support' => [
                'CPAD', 'QMSO', 'FMD', 'ICTD', 'FAD', 'HRD', 'CRI', 'COMEX',
                'IAD', 'SASC', 'ARC', 'ACD', 'CIE', 'DPIA', 'IQA', 'CPARC',
                'SRMD', 'SSD', 'CTESD',
            ],
            'Satellite Campuses' => [
                'PARDO', 'MINGLANILLA', 'TOLEDO', 'DALAGUETE'
            ],
        ];

        // Flatten groups to get a unique list of unit codes
        $allUnits = [];
        foreach ($responsibleUnitGroups as $category => $units) {
            $allUnits = array_merge($allUnits, $units);
        }
        $allUnits = array_unique($allUnits);

        $this->command->info('Provisioning accounts for ' . count($allUnits) . ' university units into MySQL...');

        foreach ($allUnits as $unit) {
            $email = Str::lower($unit) . '@uv.edu.ph';

            DB::table('users')->updateOrInsert(
                ['email' => $email], // Locate duplicate target
                [
                    'name' => $unit, 
                    'password' => Hash::make('password123'), 
                    // 🌟 Fixed: Use 'staff' to match your ENUM allowed values
                    'role' => 'staff', 
                    // 🌟 Fixed: Assign the code to your explicit column slot
                    'responsible_unit' => $unit, 
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('✅ Aligned unit accounts provisioned successfully!');
    }
}