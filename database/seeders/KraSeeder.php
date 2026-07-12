<?php

namespace Database\Seeders;

use App\Models\Kra;
use Illuminate\Database\Seeder;

class KraSeeder extends Seeder
{
    /**
     * Mirrors the keyResultAreas array in resources/js/components/app-sidebar.tsx.
     * If you edit the KRA/sub-area titles in one place, update the other.
     */
    public function run(): void
    {
        $data = [
            [
                'number' => 1,
                'title' => 'Efficient and Effective Governance, Management and Leadership',
                'reference' => 'Mission #4 and QO #4',
                'subAreas' => [
                    ['code' => '1.1', 'title' => 'Governance'],
                    ['code' => '1.2', 'title' => 'Leadership'],
                    ['code' => '1.3', 'title' => 'Human Resources Learning and Development'],
                    ['code' => '1.4', 'title' => 'Communication'],
                    ['code' => '1.5', 'title' => 'Physical Plant and Facilities'],
                    ['code' => '1.6', 'title' => 'ICT'],
                    ['code' => '1.7', 'title' => 'Finance'],
                    ['code' => '1.8', 'title' => 'Accreditation & Certification'],
                ],
            ],
            [
                'number' => 2,
                'title' => 'Quality Research and Knowledge Management',
                'reference' => 'Mission #1 and QO #3',
                'subAreas' => [
                    ['code' => '2.1', 'title' => 'Research Production, Dissemination, Utilization'],
                    ['code' => '2.2', 'title' => 'Knowledge Management'],
                    ['code' => '2.3', 'title' => 'Library'],
                ],
            ],
            [
                'number' => 3,
                'title' => 'Innovative and Excellent Teaching and Learning',
                'reference' => 'Mission #2 and QO #2',
                'subAreas' => [
                    ['code' => '3.1', 'title' => 'Faculty'],
                    ['code' => '3.2', 'title' => 'Instruction'],
                    ['code' => '3.3', 'title' => 'Innovative Education'],
                    ['code' => '3.4', 'title' => 'Employability'],
                ],
            ],
            [
                'number' => 4,
                'title' => 'Sustained Social Responsibility, Community Involvement and Industry Linkages',
                'reference' => 'Mission #3 and QO #1',
                'subAreas' => [
                    ['code' => '4.1', 'title' => 'Community Extension'],
                    ['code' => '4.2', 'title' => 'Philippine Linkages'],
                    ['code' => '4.3', 'title' => 'International Linkages'],
                ],
            ],
            [
                'number' => 5,
                'title' => 'Holistic Engagement with Students and Other Stakeholders',
                'reference' => 'Mission #4 and QO #5',
                'subAreas' => [
                    ['code' => '5.1', 'title' => 'PR and Marketing'],
                    ['code' => '5.2', 'title' => 'Customer Feedback'],
                    ['code' => '5.3', 'title' => 'Guidance & Counseling'],
                    ['code' => '5.4', 'title' => 'Student Development & Discipline'],
                    ['code' => '5.5', 'title' => 'Gender and Development Program'],
                    ['code' => '5.6', 'title' => 'Sports Development'],
                    ['code' => '5.7', 'title' => 'Arts & Culture Development'],
                    ['code' => '5.8', 'title' => 'Alumni Relations'],
                ],
            ],
        ];

        foreach ($data as $kraData) {
            $kra = Kra::updateOrCreate(
                ['number' => $kraData['number']],
                [
                    'title' => $kraData['title'],
                    'reference' => $kraData['reference'],
                ]
            );

            foreach ($kraData['subAreas'] as $sortOrder => $subArea) {
                $kra->subAreas()->updateOrCreate(
                    ['code' => $subArea['code']],
                    [
                        'title' => $subArea['title'],
                        'sort_order' => $sortOrder,
                    ]
                );
            }
        }
    }
}