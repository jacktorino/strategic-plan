<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeds the full UV Strategic Plan AY 2023-2026 hierarchy:
 * academic_years -> units -> key_result_areas -> kra_sub_areas
 * -> key_performance_indicators -> kpi_targets / kpi_unit
 * -> action_plans -> action_plan_unit
 *
 * NOTES / ASSUMPTIONS (please review before running against production data):
 * - Unit `name` is set equal to `code` for support offices/colleges whose
 *   full name wasn't spelled out in the source sheet (e.g. CPAD, FMD, ARC).
 *   Update units.name once you have the official long-form names.
 * - The sheet's "RESPONSIBLE UNIT" column mixes specific offices (CPAD, FAD)
 *   with generic groupings ("All Academic Units", "Academic & Non-Academic
 *   Units", "Academic Units (per college)"). Rather than guess which
 *   specific colleges those generic labels refer to, they're kept as their
 *   own literal `units` rows (see GENERIC_UNITS below).
 * - Units are attached at the KPI level (kpi_unit), not per individual
 *   action-plan bullet, since the source formatting doesn't reliably
 *   distinguish per-bullet ownership. If you need action_plan_unit rows for
 *   specific bullets, add them manually — the pivot table is seeded empty.
 * - academic_years.is_current is left false for all three rows; set the
 *   correct one via `--current=` logic or manually once you know "today"
 *   relative to the school calendar.
 * - Two KPIs in the source were both labeled "2.3.5" (library non-print
 *   acquisitions borrower requirement, and the non-teaching-personnel
 *   borrowing requirement). To keep `code` unique they've been renumbered
 *   2.3.5 / 2.3.6, and the original 2.3.6 (top-borrower award) became 2.3.7.
 * - KRA 5's "5.1.1" row is one KPI with five enrollment-quota variants
 *   (per college grouping). They're seeded as 5.1.1a-5.1.1e with the
 *   applicable college groupings noted in the description, since each has
 *   an independent target/quota. Adjust if you'd rather model this as a
 *   single KPI with a JSON target breakdown instead.
 * - Section 5.4 skips "5.4.2" in the source document itself — not an
 *   omission here.
 */
class StrategicPlanSeeder extends Seeder
{
    /** Support offices, colleges, and other named units. code => [name, type] */
    private const NAMED_UNITS = [
        // Central offices / support units (non_academic)
        'CPAD' => ['CPAD', 'non_academic'],
        'QMS' => ['QMS', 'non_academic'],
        'FMD' => ['FMD', 'non_academic'],
        'DPO' => ['DPO', 'non_academic'],
        'ICTD' => ['ICTD', 'non_academic'],
        'FAD' => ['FAD', 'non_academic'],
        'HRD' => ['HRD', 'non_academic'],
        'QMSO' => ['QMSO', 'non_academic'],
        'CRI' => ['CRI', 'non_academic'],
        'ARC' => ['ARC', 'non_academic'],
        'COMEX' => ['COMEX', 'non_academic'],
        'IAD' => ['IAD', 'non_academic'],
        'CIE' => ['CIE', 'non_academic'],
        'EDTECH' => ['EdTech', 'non_academic'],
        'ACD' => ['ACD', 'non_academic'],
        'SASC' => ['SASC', 'non_academic'],
        'UVAAI' => ['UVAAI', 'non_academic'],
        'ALUMNI' => ['Alumni Affairs', 'non_academic'],
        'DQMR' => ['DQMR', 'non_academic'],
        'IQA' => ['IQA', 'non_academic'],
        'QUALITY_CIRCLES' => ['Quality Circles', 'non_academic'],

        // Colleges explicitly named in the sheet (academic)
        'CAS' => ['CAS', 'academic'],
        'CBA' => ['CBA', 'academic'],
        'COED' => ['COED', 'academic'],
        'CETA' => ['CETA', 'academic'],
        'CCJE' => ['CCJE', 'academic'],
        'CAHS' => ['CAHS', 'academic'],
        'COME' => ['COME', 'academic'],
    ];

    /** Generic groupings used literally in the "RESPONSIBLE UNIT" column. */
    private const GENERIC_UNITS = [
        'ALL_ACAD' => ['All Academic Units', 'academic'],
        'ACAD_UNITS' => ['Academic Units', 'academic'],
        'NONACAD_UNITS' => ['Non-Academic Units', 'non_academic'],
        'ACAD_NONACAD' => ['Academic & Non-Academic Units', 'non_academic'],
        'ACAD_PER_COLLEGE' => ['Academic Units (per college)', 'academic'],
        'ACAD_PER_PROGRAM' => ['Academic Units (per program)', 'academic'],
    ];

    private array $unitIds = [];
    private array $ayIds = [];

    public function run(): void
    {
        DB::transaction(function () {
            $this->seedAcademicYears();
            $this->seedUnits();
            $this->seedHierarchy();
        });
    }

    private function seedAcademicYears(): void
    {
        $years = [
            ['label' => 'AY 2023-2024', 'start_year' => 2023, 'end_year' => 2024],
            ['label' => 'AY 2024-2025', 'start_year' => 2024, 'end_year' => 2025],
            ['label' => 'AY 2025-2026', 'start_year' => 2025, 'end_year' => 2026],
        ];

        foreach ($years as $year) {
            DB::table('academic_years')->updateOrInsert(
                ['start_year' => $year['start_year'], 'end_year' => $year['end_year']],
                [
                    'label' => $year['label'],
                    'is_current' => false,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        $this->ayIds = DB::table('academic_years')
            ->orderBy('start_year')
            ->pluck('id', 'start_year')
            ->toArray();
    }

    private function seedUnits(): void
    {
        foreach (array_merge(self::NAMED_UNITS, self::GENERIC_UNITS) as $code => [$name, $type]) {
            DB::table('units')->updateOrInsert(
                ['code' => $code],
                ['name' => $name, 'type' => $type, 'updated_at' => now(), 'created_at' => now()]
            );
        }

        $this->unitIds = DB::table('units')->pluck('id', 'code')->toArray();
    }

    private function seedHierarchy(): void
    {
        foreach ($this->data() as $kraData) {
            $kraId = DB::table('key_result_areas')->updateOrInsert(
                ['number' => $kraData['number']],
                [
                    'title' => $kraData['title'],
                    'reference' => $kraData['reference'] ?? null,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
            $kraId = DB::table('key_result_areas')->where('number', $kraData['number'])->value('id');

            foreach ($kraData['sub_areas'] as $subOrder => $subData) {
                DB::table('kra_sub_areas')->updateOrInsert(
                    ['code' => $subData['code']],
                    [
                        'kra_id' => $kraId,
                        'title' => $subData['title'],
                        'sort_order' => $subOrder,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
                $subAreaId = DB::table('kra_sub_areas')->where('code', $subData['code'])->value('id');

                foreach ($subData['kpis'] as $kpiOrder => $kpiData) {
                    DB::table('key_performance_indicators')->updateOrInsert(
                        ['code' => $kpiData['code']],
                        [
                            'sub_area_id' => $subAreaId,
                            'description' => $kpiData['description'],
                            'sort_order' => $kpiOrder,
                            'updated_at' => now(),
                            'created_at' => now(),
                        ]
                    );
                    $kpiId = DB::table('key_performance_indicators')->where('code', $kpiData['code'])->value('id');

                    // Targets: index 0/1/2 -> AY 2023-2024 / 2024-2025 / 2025-2026
                    $startYears = [2023, 2024, 2025];
                    foreach ($kpiData['targets'] as $i => $target) {
                        if (!isset($startYears[$i], $this->ayIds[$startYears[$i]])) {
                            continue;
                        }
                        DB::table('kpi_targets')->updateOrInsert(
                            [
                                'kpi_id' => $kpiId,
                                'academic_year_id' => $this->ayIds[$startYears[$i]],
                            ],
                            [
                                'target_percentage' => $target,
                                'updated_at' => now(),
                                'created_at' => now(),
                            ]
                        );
                    }

                    // KPI-level responsible units
                    foreach ($kpiData['units'] ?? [] as $unitCode) {
                        if (!isset($this->unitIds[$unitCode])) {
                            continue;
                        }
                        DB::table('kpi_unit')->updateOrInsert(
                            ['kpi_id' => $kpiId, 'unit_id' => $this->unitIds[$unitCode]],
                            ['updated_at' => now(), 'created_at' => now()]
                        );
                    }

                    // Action plans
                    foreach ($kpiData['action_plans'] ?? [] as $apOrder => $description) {
                        DB::table('action_plans')->updateOrInsert(
                            ['kpi_id' => $kpiId, 'description' => $description],
                            ['sort_order' => $apOrder, 'updated_at' => now(), 'created_at' => now()]
                        );
                    }
                }
            }
        }
    }

    /**
     * Full KRA -> sub-area -> KPI data set transcribed from the
     * "UV Strategic Plan AY 2023-2026" sheet.
     */
    private function data(): array
    {
        return [
            [
                'number' => 1,
                'title' => 'EFFICIENT AND EFFECTIVE GOVERNANCE, MANAGEMENT AND LEADERSHIP',
                'reference' => 'Mission #4 and QO #4',
                'sub_areas' => [
                    [
                        'code' => '1.1', 'title' => 'Governance',
                        'kpis' => [
                            [
                                'code' => '1.1.1',
                                'description' => 'Deployment and dissemination of VMO, Quality Management System in all units',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'QMS', 'FMD'],
                                'action_plans' => [
                                    'Upload the VMO in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.',
                                    'Upload the PQF Levels 6-8 Descriptors and the UV Institutional Learning Outcomes in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.',
                                    'Integrate in the course syllabi and activities of all programs across campuses, colleges and units.',
                                    "Integration in all classes' orientation and recitation in all units' regular meetings.",
                                ],
                            ],
                            [
                                'code' => '1.1.2',
                                'description' => 'Alignment and dissemination of 17 UN Sustainable Development Goals in all university operations.',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'QMS', 'FMD'],
                                'action_plans' => [
                                    'Upload the 17 UN SDGs in the website, official social media accounts, and post in the conspicuous places/areas in the University Campuses.',
                                    'Integrate in the course syllabi and activities of all programs across campuses, colleges and units.',
                                    "Integration in all classes' orientation and recitation in all units' regular meetings.",
                                ],
                            ],
                            [
                                'code' => '1.1.3',
                                'description' => '100% of Senior Leaders and other stakeholders participate in the Quality Assurance Review and Planning.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_NONACAD'],
                                'action_plans' => [
                                    "Senior leaders and stakeholders participate actively in the scheduled Quality Assurance Review and Planning towards continuous improvement and stakeholders' satisfaction.",
                                    'Regularly recognize the valuable contribution of the stakeholders.',
                                ],
                            ],
                            [
                                'code' => '1.1.4',
                                'description' => 'Compliance with the National Privacy Commission requirements',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_NONACAD', 'DPO', 'ICTD', 'FAD'],
                                'action_plans' => [
                                    'Undertake audit procedures on data privacy.',
                                    'Implement an awareness program for employees to improve privacy knowledge, skills, attitude, and behavior.',
                                    'Install much-needed security software to protect data on all devices used in the University and its satellite campuses.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.2', 'title' => 'Leadership',
                        'kpis' => [
                            [
                                'code' => '1.2.1',
                                'description' => '100% involvement of all senior leaders in University Committee Leadership/Memberships',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_NONACAD'],
                                'action_plans' => [
                                    'Senior Leaders should chair/vice chair/member of at least one (1) university/college committee.',
                                    'Ensure continuity of involvement in university committee leadership/memberships by assigning assistants or associates to every senior leader occupying chairmanship positions in various committees.',
                                ],
                            ],
                            [
                                'code' => '1.2.2',
                                'description' => '100% involvement in 5S program',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_NONACAD'],
                                'action_plans' => [
                                    'Conduct periodic implementation audit of 5S in the different units across all campuses.',
                                    'Conduct Capacity-Building for 5S Implementers.',
                                ],
                            ],
                            [
                                'code' => '1.2.3',
                                'description' => '100% involvement of all employees in the Quality Circles',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_NONACAD'],
                                'action_plans' => [
                                    'Organize and orient employees on the policies and procedures of the University Quality Circles.',
                                    'Deployment of the policies and procedures of the University Quality Circles.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.3', 'title' => 'Human Resources Learning and Development',
                        'kpis' => [
                            [
                                'code' => '1.3.1',
                                'description' => '100% participation in university-wide learning and development program',
                                'targets' => [100, 100, 100],
                                'units' => ['HRD', 'NONACAD_UNITS'],
                                'action_plans' => [
                                    'Conduct training needs assessment as a basis in crafting the learning and development program for non-teaching personnel.',
                                    'Attend and complete at least one online training/webinar aligned to the job function.',
                                ],
                            ],
                            [
                                'code' => '1.3.2',
                                'description' => '100% academic development participation in unit faculty program',
                                'targets' => [100, 100, 100],
                                'units' => ['HRD', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Conduct training assessment as basis for crafting the development program needs of the faculty.',
                                    'Attendance to at least one online training or webinar aligned to the field of specialization.',
                                    'Include Faculty Immersion program and have it implemented during the Special Period.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.4', 'title' => 'Communication',
                        'kpis' => [
                            [
                                'code' => '1.4.1',
                                'description' => '100% deployment of internal and external communication guidelines/protocols.',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_NONACAD'],
                                'action_plans' => [
                                    'Efficient and regular use of corporate emails and online systems in inter-office communication by customizing Office 365 features and applications for secured and reliable communication processes.',
                                    'Establish a contingency communication plan with due consideration for security for unexpected challenges.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.5', 'title' => 'Physical Plant and Facilities',
                        'kpis' => [
                            [
                                'code' => '1.5.1',
                                'description' => '100% completion in crafting the 3-year campus development plan.',
                                'targets' => [100, 100, 100],
                                'units' => ['FMD'],
                                'action_plans' => ['Prepare a campus development plan.'],
                            ],
                            [
                                'code' => '1.5.2',
                                'description' => 'Implementation of the 3-year campus development plan.',
                                'targets' => [30, 50, 100],
                                'units' => ['FMD'],
                                'action_plans' => ['Monitoring of the campus development plan implementation.'],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.6', 'title' => 'ICT',
                        'kpis' => [
                            [
                                'code' => '1.6.1',
                                'description' => '100% up to date, innovative and user friendly, functional website and automation systems',
                                'targets' => [100, 100, 100],
                                'units' => ['ICTD', 'CPAD', 'ACAD_UNITS'],
                                'action_plans' => ['Maintain regularly an updated website and automation system.'],
                            ],
                            [
                                'code' => '1.6.2',
                                'description' => '100% improvement of ICT network infrastructure capability',
                                'targets' => [50, 100, 100],
                                'units' => ['ICTD', 'FAD'],
                                'action_plans' => [
                                    'Maintain regularly an upgraded IT infrastructure.',
                                    'Install much-needed security software to protect data on all devices used in the University and its satellite campuses.',
                                    'Host secured systems over the cloud.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.7', 'title' => 'Finance',
                        'kpis' => [
                            [
                                'code' => '1.7.1',
                                'description' => 'Increase accounts receivable collection efficiency to 98%.',
                                'targets' => [95, 98, 100],
                                'units' => ['FAD', 'ACAD_UNITS', 'ICTD'],
                                'action_plans' => [
                                    'Efficient deployment of a cashless payment scheme.',
                                    "Close monitoring of students' accounts and consistent reminders to students.",
                                    'Strengthen partnership/linkages with financing intermediaries who could offer educational loans to students.',
                                    'Integrate the available payment channels in the Enrolment system.',
                                    "Create a University Communication System to update students on their school fees.",
                                ],
                            ],
                            [
                                'code' => '1.7.2',
                                'description' => 'Zero complaints from students of late posting or unposted online payments every day.',
                                'targets' => [100, 100, 100],
                                'units' => ['FAD', 'ICTD'],
                                'action_plans' => ['Monitor daily status report of online collections to ensure on-time and accurate posting of student online payments.'],
                            ],
                            [
                                'code' => '1.7.3',
                                'description' => 'Utilization of resources based on approved budget for all units',
                                'targets' => [100, 100, 100],
                                'units' => ['FAD', 'ACAD_NONACAD'],
                                'action_plans' => [
                                    'Monitoring of the actual expenditures versus approved budget.',
                                    'Create and integrate the purchasing system with the existing accounting system (Ledgea).',
                                    'Submission of weekly Purchase monitoring sheet to track status of requests.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '1.8', 'title' => 'Accreditation & Certification',
                        'kpis' => [
                            [
                                'code' => '1.8.1',
                                'description' => '100% Compliance with Institutional Sustainability Assessment (ISA) Standards',
                                'targets' => [100, 100, 100],
                                'units' => ['QMSO', 'QUALITY_CIRCLES', 'ACAD_UNITS'],
                                'action_plans' => ['Regular review of compliance to standards and submission of action plan to address gaps.'],
                            ],
                            [
                                'code' => '1.8.2',
                                'description' => '100% Compliance with Autonomous Standards',
                                'targets' => [100, 100, 100],
                                'units' => ['QMSO', 'QUALITY_CIRCLES', 'ACAD_UNITS'],
                                'action_plans' => ['Regular review of compliance to standards and submission of action plan to address gaps.'],
                            ],
                            [
                                'code' => '1.8.3',
                                'description' => '100% Compliance to PACUCOA Accreditation standards for all programs',
                                'targets' => [100, 100, 100],
                                'units' => ['ALL_ACAD', 'QUALITY_CIRCLES', 'QMSO'],
                                'action_plans' => ['Compliance to standards and submission of action plan to address gaps.'],
                            ],
                            [
                                'code' => '1.8.4',
                                'description' => '100% compliance with CHED COD/COE standard',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE', 'QMSO', 'QUALITY_CIRCLES'],
                                'action_plans' => ['Regular review of compliance to standards and submission of action plan to address gaps.'],
                            ],
                            [
                                'code' => '1.8.5',
                                'description' => '100% Compliance to International accreditation standards.',
                                'targets' => [25, 50, 100],
                                'units' => ['ACAD_PER_COLLEGE', 'QMSO', 'QUALITY_CIRCLES'],
                                'action_plans' => ['All quality circles to review requirements and submit action plans to address gaps.'],
                            ],
                            [
                                'code' => '1.8.6',
                                'description' => '100% Compliance with ISO 9001:2015 version by AY 2023-2026',
                                'targets' => [100, 100, 100],
                                'units' => ['QMSO', 'ACAD_NONACAD'],
                                'action_plans' => ['Monitoring, review and evaluation of compliance to ISO 9001:2015 standards.'],
                            ],
                            [
                                'code' => '1.8.7',
                                'description' => '100% Compliance to National Competency Certification with TESDA qualified assessors.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_PROGRAM'],
                                'action_plans' => ['Identify, train and capacitate faculty members to take the assessments to qualify as TESDA assessors.'],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'number' => 2,
                'title' => 'QUALITY RESEARCH AND KNOWLEDGE MANAGEMENT',
                'reference' => 'Mission #1 and QO #3',
                'sub_areas' => [
                    [
                        'code' => '2.1', 'title' => 'Research Production, Dissemination, Utilization',
                        'kpis' => [
                            [
                                'code' => '2.1.1',
                                'description' => 'Full time faculty personnel are engaged in research',
                                'targets' => [100, 100, 100],
                                'units' => ['CRI', 'ACAD_NONACAD'],
                                'action_plans' => [
                                    'Creation of a core team among research coordinators, teaching and non-teaching personnel.',
                                    'Conduct weekly research didactics for the faculty.',
                                ],
                            ],
                            [
                                'code' => '2.1.2',
                                'description' => 'At least one research capacity and capability building per college per semester',
                                'targets' => [100, 100, 100],
                                'units' => ['CRI', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Conduct Discipline-Specific Research Capability Trainings and Workshops per Semester for every College/Program including non-teaching staff based on the results of the needs assessment survey.',
                                    'Produce outputs which use NETNOGRAPHY research design and big data analysis.',
                                ],
                            ],
                            [
                                'code' => '2.1.3',
                                'description' => 'One research journal per college per academic year',
                                'targets' => [100, 100, 100],
                                'units' => ['CRI', 'ACAD_UNITS'],
                                'action_plans' => ['Publish research outputs in the college research journal.'],
                            ],
                            [
                                'code' => '2.1.4',
                                'description' => 'At least two research-based science and technology applications for patent and/or at least four utility models',
                                'targets' => [20, 50, 100],
                                'units' => ['CRI', 'ACAD_PER_COLLEGE'],
                                'action_plans' => ['Forge collaborative research among different disciplines in the university.'],
                            ],
                            [
                                'code' => '2.1.5',
                                'description' => 'At least one (1) research output from Non-Teaching Personnel per unit',
                                'targets' => [100, 100, 100],
                                'units' => ['CRI', 'NONACAD_UNITS'],
                                'action_plans' => ['Conduct a training and workshop on writing a publishable format research.'],
                            ],
                            [
                                'code' => '2.1.6',
                                'description' => 'Utilize tracer study results yearly per academic unit',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => ['Innovate curricula and improve learning outcomes and graduate competencies.'],
                            ],
                            [
                                'code' => '2.1.7',
                                'description' => 'Thesis/dissertation are IMRAD-ready',
                                'targets' => [100, 100, 100],
                                'units' => ['CRI', 'ACAD_PER_COLLEGE'],
                                'action_plans' => ['Modify thesis/dissertation format to become IMRAD-ready.'],
                            ],
                        ],
                    ],
                    [
                        'code' => '2.2', 'title' => 'Knowledge Management',
                        'kpis' => [
                            [
                                'code' => '2.2.1',
                                'description' => '100% deployment of knowledge management system, measurement and analysis.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_UNITS', 'HRD'],
                                'action_plans' => [
                                    'Prepare a Knowledge Management Manual containing forms and SOPPs based on the listed processes and procedures.',
                                    'Deployment of Knowledge Management System activities per unit.',
                                    'Include the KM System in the scheduled re-orientation program.',
                                    'Include KPI of Knowledge Management in the Performance Evaluation per unit.',
                                    'Introduce knowledge management programs to the Visayanian community through exposure of programs to e-media channels.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '2.3', 'title' => 'Library',
                        'kpis' => [
                            [
                                'code' => '2.3.1',
                                'description' => '30% print acquisitions within AY 2023-2026',
                                'targets' => [10, 20, 30],
                                'units' => ['ACAD_UNITS', 'ARC'],
                                'action_plans' => ['Beef up collections of printed resources in collaboration with the academic units.'],
                            ],
                            [
                                'code' => '2.3.2',
                                'description' => '70% non-print acquisitions within the AY 2023-2026',
                                'targets' => [50, 75, 100],
                                'units' => ['ACAD_UNITS', 'ARC'],
                                'action_plans' => ['Improve collections of relevant electronic resources by participating in a consortium with other universities.'],
                            ],
                            [
                                'code' => '2.3.3',
                                'description' => '100% information dissemination and accessibility of academic resources, print & non-print.',
                                'targets' => [100, 100, 100],
                                'units' => ['ICTD', 'CPAD', 'ARC'],
                                'action_plans' => [
                                    'Integrate the library management system in the university website.',
                                    'Create infographics (digital library guides) to encourage all faculty and students to fully maximize the utilization of all library resources and services.',
                                ],
                            ],
                            [
                                'code' => '2.3.4',
                                'description' => '100% of Full-time faculty accessed and utilized the academic resources per month',
                                'targets' => [50, 100, 100],
                                'units' => ['ACAD_UNITS', 'ARC'],
                                'action_plans' => ['Require all full-time faculty to borrow at least two books per month and access the e-learning resources through the library management system.'],
                            ],
                            [
                                // Source labels this "2.3.5" — students borrowing requirement.
                                'code' => '2.3.5',
                                'description' => 'Students accessed and utilized the academic resources per month within the AY 2023-2026',
                                'targets' => [50, 75, 100],
                                'units' => ['ACAD_UNITS', 'ARC'],
                                'action_plans' => ['Require all students to borrow at least two books per month and access the e-learning resources through the library management system.'],
                            ],
                            [
                                // Source also labels this "2.3.5" (duplicate) — non-teaching personnel
                                // borrowing requirement; renumbered here to keep `code` unique.
                                'code' => '2.3.6',
                                'description' => 'Non-Teaching personnel should borrow and read at least one book per month',
                                'targets' => [100, 100, 100],
                                'units' => ['NONACAD_UNITS', 'ARC'],
                                'action_plans' => ['Require the non-teaching personnel to visit the ARC and/or access the library management system and utilize the available resources.'],
                            ],
                            [
                                // Source labels this "2.3.6" (award) — renumbered to 2.3.7 to avoid
                                // colliding with the borrowing KPI above.
                                'code' => '2.3.7',
                                'description' => 'At least one recipient per department per semester for the top academic resources borrower award from the following: a) faculty, b) non-teaching, and c) students',
                                'targets' => [100, 100, 100],
                                'units' => ['ARC'],
                                'action_plans' => ['Set criteria for the recognition and prepare a monitoring matrix on ARC resources utilization.'],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'number' => 3,
                'title' => 'INNOVATIVE AND EXCELLENT TEACHING AND LEARNING',
                'reference' => 'Mission #2 and QO #2',
                'sub_areas' => [
                    [
                        'code' => '3.1', 'title' => 'Faculty',
                        'kpis' => [
                            [
                                'code' => '3.1.1',
                                'description' => 'Full Time faculty members will have the required qualifications/minimum academic qualifications: Higher Education Graduate degree=100%; Basic Education LET Passer=100%, Graduate degree=30%',
                                'targets' => [100, 100, 100],
                                'units' => ['HRD', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Strictly comply with the CHED minimum academic qualifications when hiring personnel for academic positions.',
                                    'Encourage academic personnel to avail of the educational scholarship.',
                                    'Craft a 5-year faculty development plan and monitor its implementation.',
                                ],
                            ],
                            [
                                'code' => '3.1.2',
                                'description' => '90% of the faculty meets a performance rating of at least 4.51',
                                'targets' => [100, 100, 100],
                                'units' => ['HRD', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Regularly evaluate the faculty using the revised/updated performance evaluation tool.',
                                    'Automated Faculty Evaluation System integrated with the Student Portal.',
                                ],
                            ],
                            [
                                'code' => '3.1.3',
                                'description' => 'Full-time faculty are members of relevant professional organizations.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_UNITS'],
                                'action_plans' => ['Require all full-time faculty to be involved as a member or officer in a professional organization aligned to their discipline.'],
                            ],
                            [
                                'code' => '3.1.4',
                                'description' => 'At least one class section advisership every semester',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => ['Homeroom organization in regular classes.'],
                            ],
                            [
                                'code' => '3.1.5',
                                'description' => 'Deployment of Ranking, Tenureship & Promotion',
                                'targets' => [100, 100, 100],
                                'units' => ['HRD', 'ACAD_PER_COLLEGE'],
                                'action_plans' => ['Faculty responds to the call for ranking, submits application, and provides required evidence for ranking.'],
                            ],
                        ],
                    ],
                    [
                        'code' => '3.2', 'title' => 'Instruction',
                        'kpis' => [
                            [
                                'code' => '3.2.1',
                                'description' => 'Compliance with Curriculum Validation every semester',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => [
                                    'Prepare a curriculum validation policy.',
                                    'Conduct a curriculum validation before the end of each semester.',
                                    'Develop an automated system embedded in the UV ACCESS LMS as part of course compliance.',
                                ],
                            ],
                            [
                                'code' => '3.2.2',
                                'description' => '100% compliance with Curriculum Evaluation every four/five years',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => [
                                    'Conduct a curriculum evaluation every four or five years.',
                                    'Conduct a seminar/workshop/training for all prospective participants (IAAC members) on the conduct of curriculum review and evaluation.',
                                ],
                            ],
                            [
                                'code' => '3.2.3',
                                'description' => 'Compliance to selective retention guidelines.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => [
                                    'Prepare selective retention policies for all programs.',
                                    'Comply with selective retention policies in all programs.',
                                    'Integrate the retention policy of each program into the University website.',
                                ],
                            ],
                            [
                                'code' => '3.2.4',
                                'description' => 'Above national passing percentage for all licensure/bar exams for 1st time takers.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => ['Deployment of a board exam preparation policy.'],
                            ],
                            [
                                'code' => '3.2.5',
                                'description' => 'Deployment of at least one external certification per program for faculty.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_PROGRAM'],
                                'action_plans' => [
                                    'Capacitate and train faculty to deliver the external certification programs.',
                                    'Establish partnerships with agencies/institutions providing certification programs.',
                                ],
                            ],
                            [
                                'code' => '3.2.6',
                                'description' => 'Integration of One NC per program',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_UNITS', 'EDTECH'],
                                'action_plans' => ['Verify with TESDA available NC programs aligned to the programs offered.'],
                            ],
                            [
                                'code' => '3.2.7',
                                'description' => 'Organize student Quality Circles in all year levels',
                                'targets' => [100, 100, 100],
                                'units' => ['ALL_ACAD'],
                                'action_plans' => ["Identify students who will compose the quality circle per college/per year level and organize them according to the Students' Quality Circle policy."],
                            ],
                            [
                                'code' => '3.2.8',
                                'description' => '3rd year students should take sub-professional and professional Civil Service examinations',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => [
                                    'Orient students on the types of civil service exam and career advancement in terms of qualification.',
                                    'Facilitate application for the civil service examination in both Pencil and Paper Test and Computer-Based Examination procedures.',
                                ],
                            ],
                            [
                                'code' => '3.2.9',
                                'description' => 'Faculty Members should acquire a score of C1 in the International English Language Certification.',
                                'targets' => [50, 100, 100],
                                'units' => ['ALL_ACAD'],
                                'action_plans' => ['Prepare an intervention program across all academic units.'],
                            ],
                            [
                                'code' => '3.2.10',
                                'description' => 'Students should acquire a score of B1 in the International English Language Certification.',
                                'targets' => [30, 50, 100],
                                'units' => ['ACAD_PER_COLLEGE'],
                                'action_plans' => ['Prepare an intervention program across all year levels.'],
                            ],
                        ],
                    ],
                    [
                        'code' => '3.3', 'title' => 'Innovative Education',
                        'kpis' => [
                            [
                                'code' => '3.3.1',
                                'description' => '100% implementation of the E-learning program/roadmap',
                                'targets' => [100, 100, 100],
                                'units' => ['ALL_ACAD', 'CIE'],
                                'action_plans' => [
                                    'Develop Online Course Module per program per College in Office 365 and Open LMS.',
                                    'Develop Hyflex Learning Strategy in all colleges.',
                                    'Provide professional development training courses on ICT for faculty and staff (e.g. AI, KM, IoT, data science).',
                                    'Retooling on integration of MS Teams in the LMS (UV ACCESS).',
                                    'Strategic partnership with technology companies through MOA and MOU.',
                                    'Integrate AI/Robotics in all courses.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '3.4', 'title' => 'Employability',
                        'kpis' => [
                            [
                                'code' => '3.4.1',
                                'description' => 'Graduates are engaged in gainful activities and professional development within 12-months after graduation (employment, entrepreneurship, graduate studies).',
                                'targets' => [50, 80, 100],
                                'units' => ['CPAD', 'ALUMNI', 'ACAD_PER_COLLEGE'],
                                'action_plans' => [
                                    'Monitor graduates to document their employment, engagement in entrepreneurial activities, or pursuit of further studies.',
                                    'Provide incentives to encourage graduates to give feedback when they get a job after graduation.',
                                    'Conduct a regular job fair in collaboration with industry partners and document those hired on the spot.',
                                ],
                            ],
                            [
                                'code' => '3.4.2',
                                'description' => 'Establish at least 2-industry partners per semester/program',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'IAD', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Identify local and international companies and start networking for partnerships.',
                                    'Build collaborative programs that are mutually beneficial for the industry and the college/university.',
                                ],
                            ],
                            [
                                'code' => '3.4.3',
                                'description' => 'Conduct the annual tracer study',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ALUMNI', 'CRI', 'ACAD_PER_COLLEGE'],
                                'action_plans' => [
                                    'Initiate the conduct of the annual graduate tracer studies.',
                                    'Collaborate with the colleges and alumni affairs in the deployment of the graduate tracer survey questionnaire.',
                                    'Utilize data gathered from the tracer study and convert it into a research paper in coordination with the CRI.',
                                    'Cascade results to the colleges as input to improve programs.',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'number' => 4,
                'title' => 'SUSTAINED SOCIAL RESPONSIBILITY, COMMUNITY INVOLVEMENT AND INDUSTRY LINKAGES',
                'reference' => 'Mission #3 and QO #1',
                'sub_areas' => [
                    [
                        'code' => '4.1', 'title' => 'Community Extension',
                        'kpis' => [
                            [
                                'code' => '4.1.1',
                                'description' => '100% sectoral representation in community extension programs',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_NONACAD', 'ALUMNI'],
                                'action_plans' => ['Involvement of all stakeholders.'],
                            ],
                            [
                                'code' => '4.1.2',
                                'description' => 'Conduct at least 2 full researches per academic unit and at least one from the non-teaching personnel',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_PER_COLLEGE', 'NONACAD_UNITS', 'CRI'],
                                'action_plans' => ['Conduct at least one (1) extension program from these researches.'],
                            ],
                            [
                                'code' => '4.1.3',
                                'description' => 'Involvement and participation in the environmental protection and preservation',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_PER_COLLEGE', 'NONACAD_UNITS', 'CRI'],
                                'action_plans' => ['Develop programs related to Environmental Protection and Conservation.'],
                            ],
                            [
                                'code' => '4.1.4',
                                'description' => 'Sustain the Community Tutorial program. Expansion of the program to the other 6 sitios by the 2nd semester of AY 2023-2024',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_NONACAD'],
                                'action_plans' => ['Sustain the community tutorial program and expand it to other surrounding communities.'],
                            ],
                            [
                                'code' => '4.1.5',
                                'description' => '100% implementation, involvement and participation from all colleges/departments during AY 2023-2026',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_NONACAD', 'CPAD'],
                                'action_plans' => [
                                    'Participation of the COMEX representative, faculty and student representatives per program, and the college dean from planning to evaluation.',
                                    'Posting of COMEX activities on the UV Facebook page and website.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '4.2', 'title' => 'Philippine Linkages',
                        'kpis' => [
                            [
                                'code' => '4.2.1',
                                'description' => 'At least one active partnership with government, industry or NGO per academic unit every semester',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_UNITS'],
                                'action_plans' => ['Document all networking with national and regional organizations by all academic units.'],
                            ],
                        ],
                    ],
                    [
                        'code' => '4.3', 'title' => 'International Linkages',
                        'kpis' => [
                            [
                                'code' => '4.3.1',
                                'description' => 'At least one active partnership with an international university per academic unit per semester.',
                                'targets' => [100, 100, 100],
                                'units' => ['COMEX', 'ACAD_UNITS'],
                                'action_plans' => ['Document all networking with international organizations by all academic units.'],
                            ],
                            [
                                'code' => '4.3.2',
                                'description' => 'At least 1 faculty exchange per academic unit for academic year 2024-2025.',
                                'targets' => [100, 100, 100],
                                'units' => ['IAD', 'ACAD_UNITS'],
                                'action_plans' => ['Deployment of activities stipulated in the MOA/MOU.'],
                            ],
                            [
                                'code' => '4.3.3',
                                'description' => 'At least 2 student exchange programs per academic unit for academic year 2024-2025.',
                                'targets' => [100, 100, 100],
                                'units' => ['IAD', 'ACAD_UNITS'],
                                'action_plans' => ['Deployment of activities stipulated in the MOA/MOU.'],
                            ],
                            [
                                'code' => '4.3.4',
                                'description' => 'At least 1 collaborative Research Activity/Colloquium Activity such as: Production, Publication, Presentation, and Utilization',
                                'targets' => [100, 100, 100],
                                'units' => ['IAD', 'ACAD_UNITS'],
                                'action_plans' => ['Deployment of activities stipulated in the MOA/MOU.'],
                            ],
                            [
                                'code' => '4.3.5',
                                'description' => 'At least 50 admissions of Foreign Students enrolled in any academic program for academic year 2024-2025.',
                                'targets' => [100, 100, 100],
                                'units' => ['IAD', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Produce at least one campaign for each type (commercial, reputation, education/awareness, and social action) per semester.',
                                    'Develop at least one campaign per semester intended for the international market.',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'number' => 5,
                'title' => 'HOLISTIC ENGAGEMENT WITH STUDENTS AND OTHER STAKEHOLDERS',
                'reference' => 'Mission #4 and QO #5',
                'sub_areas' => [
                    [
                        'code' => '5.1', 'title' => 'PR and Marketing',
                        'kpis' => [
                            [
                                'code' => '5.1.1a',
                                'description' => 'At least 300 freshmen students for colleges with single program offering (CCJE)',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_UNITS', 'SASC', 'CRI', 'CCJE'],
                                'action_plans' => [
                                    'Conduct FGDs as one of the tools to get feedback and inputs.',
                                    'Increase field marketing campaigns to private academic institutions.',
                                    'Create more page engagement on Facebook on a daily/weekly basis to reach more page likes and follows, and expand to other social media for advertisement and promotion.',
                                    "Create an enhanced 'enroll now, pay later' scheme and sponsorship programs to help students pursue their studies.",
                                ],
                            ],
                            [
                                'code' => '5.1.1b',
                                'description' => 'At least 500 freshmen students for colleges with two to three program offerings and with at least 50 students/program (CAHS, COME)',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_UNITS', 'SASC', 'CRI', 'CAHS', 'COME'],
                                'action_plans' => [],
                            ],
                            [
                                'code' => '5.1.1c',
                                'description' => 'At least 600 freshmen students for colleges with more than three program offerings and with at least 50 students/program (CAS, CBA, COED, CETA)',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_UNITS', 'SASC', 'CRI', 'CAS', 'CBA', 'COED', 'CETA'],
                                'action_plans' => [],
                            ],
                            [
                                'code' => '5.1.1d',
                                'description' => 'At least 100 freshmen students for JD.',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_UNITS', 'SASC', 'CRI'],
                                'action_plans' => [],
                            ],
                            [
                                'code' => '5.1.1e',
                                'description' => 'At least 600 Grade 11 students with at least 50 students/track.',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_UNITS', 'SASC', 'CRI'],
                                'action_plans' => [],
                            ],
                            [
                                'code' => '5.1.2',
                                'description' => "Achieve at least 80% students' retention",
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_PER_COLLEGE', 'NONACAD_UNITS'],
                                'action_plans' => [
                                    "Implement JRG's 'Himunga-an System'.",
                                    "Strengthen students' academic advising.",
                                    "Sustain students' positive experiences through exceptional customer service across all units.",
                                ],
                            ],
                            [
                                'code' => '5.1.3',
                                'description' => 'Submission of College Marketing Plan',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_PER_COLLEGE'],
                                'action_plans' => ['Conduct webinars and prepare a Marketing Plan.'],
                            ],
                            [
                                'code' => '5.1.4',
                                'description' => 'Deployment of the university campaign advertisement materials per semester',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ALL_ACAD'],
                                'action_plans' => [
                                    'Produce at least one campaign for each type (commercial, reputation, education/awareness, and social action) per semester.',
                                    'Develop at least one campaign per semester intended for the international market.',
                                ],
                            ],
                            [
                                'code' => '5.1.5',
                                'description' => 'Five (5) signed MOA per Academic Year with the feeder school',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ALL_ACAD'],
                                'action_plans' => ['Seal at least five (5) Feeder School Partnerships per academic year.'],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.2', 'title' => 'Customer Feedback',
                        'kpis' => [
                            [
                                'code' => '5.2.1',
                                'description' => 'Deployment of the Best Innovative Procedures Award (BIPA) and customer feedback mechanism in all units',
                                'targets' => [100, 100, 100],
                                'units' => ['CPAD', 'ACAD_NONACAD', 'SASC'],
                                'action_plans' => ['Strengthen the feedback system through the university online portal and other mechanisms where stakeholders can convey service satisfaction and experiences.'],
                            ],
                            [
                                'code' => '5.2.2',
                                'description' => 'Response to customer feedback within seven days',
                                'targets' => [100, 100, 100],
                                'units' => ['SASC', 'ALL_ACAD'],
                                'action_plans' => [
                                    'Timely feedback system through the university online portal and other mechanisms where stakeholders can convey service satisfaction and experiences.',
                                    'Orient internal stakeholders on the various feedback mechanisms and the Standard Operating Policies and Procedures on Customer Feedback Facilitation.',
                                    'Create a customer feedback committee comprising employees from Academic Units, Support Service Offices, and the President of SSC to ensure sincere involvement.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.3', 'title' => 'Guidance & Counseling',
                        'kpis' => [
                            [
                                'code' => '5.3.1',
                                'description' => 'Deployment of counseling program',
                                'targets' => [100, 100, 100],
                                'units' => ['SASC', 'ALL_ACAD'],
                                'action_plans' => [
                                    'Sustain the implementation of the Guidance and Counseling program through a Flexible Deployment Program.',
                                    'Link with different private or government agencies offering Psychological Assessment, Debriefing and Medical Assistance, and refer students with special needs to specialists concerned.',
                                    'Partner with industries or companies on the deployment of CIP.',
                                    'Implement a peer counseling program.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.4', 'title' => 'Student Development & Discipline',
                        'kpis' => [
                            [
                                'code' => '5.4.1',
                                'description' => 'Deployment of student planned extracurricular activities.',
                                'targets' => [100, 100, 100],
                                'units' => ['SASC', 'ALL_ACAD'],
                                'action_plans' => ['Participate in inter-school competitions which give students the opportunity to exhibit and unleash their talents and potentials.'],
                            ],
                            [
                                'code' => '5.4.3',
                                'description' => '2% decrease of student violations',
                                'targets' => [100, 100, 100],
                                'units' => ['SASC', 'ACAD_UNITS'],
                                'action_plans' => [
                                    'Developmental Program Plan on student discipline that counters the challenges of the new normal.',
                                    'Sustain monitoring mechanism of student behavioral concerns.',
                                    'Conduct regular awareness drives on the digital mechanisms for monitoring student behavior.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.5', 'title' => 'Gender and Development Program',
                        'kpis' => [
                            [
                                'code' => '5.5.1',
                                'description' => 'Deployment of the Gender and development program',
                                'targets' => [100, 100, 100],
                                'units' => ['ALL_ACAD', 'SASC'],
                                'action_plans' => ["Create gender-inclusive teaching materials and resources for teachers to enhance classroom discussion."],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.6', 'title' => 'Sports Development',
                        'kpis' => [
                            [
                                'code' => '5.6.1',
                                'description' => '100% involvement in intramural and extramural activities',
                                'targets' => [100, 100, 100],
                                'units' => ['SASC', 'ACAD_UNITS', 'COMEX', 'ACD'],
                                'action_plans' => [
                                    "Organize sports leagues among the system schools with the support of the schools' linkages and broadcast them through online platforms for a global audience.",
                                    'Create Virtual Intramural activities for students and other stakeholders with the support of alumni and sponsors.',
                                    'Invite alumni and company representatives as resource speakers for fitness and sports-related webinars.',
                                    'Initiate, reconnect, and create linkages with former sponsors and alumni.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.7', 'title' => 'Arts & Culture Development',
                        'kpis' => [
                            [
                                'code' => '5.7.1',
                                'description' => 'Organize at least one NTPIF/Faculty/Student arts and culture program per semester.',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_NONACAD', 'SASC', 'ACD'],
                                'action_plans' => [
                                    'Create a Culture and Arts development program plan.',
                                    'Create a virtual platform for cultural and artistic performances and exhibitions.',
                                    'Create virtual and in-person cultural and artistic performances and exhibitions.',
                                    'Intensify the promotion of Arts and Culture activities by increasing social media engagement.',
                                ],
                            ],
                        ],
                    ],
                    [
                        'code' => '5.8', 'title' => 'Alumni Relations',
                        'kpis' => [
                            [
                                'code' => '5.8.1',
                                'description' => 'Strengthen alumni chapters in all academic units',
                                'targets' => [100, 100, 100],
                                'units' => ['ACAD_UNITS', 'ALUMNI'],
                                'action_plans' => [
                                    'Creation of a chapter alumni development plan in all academic units.',
                                    'Creation of an International Alumni Chapter.',
                                ],
                            ],
                            [
                                'code' => '5.8.2',
                                'description' => 'Organize university-wide Alumni Homecoming/Reunion every year',
                                'targets' => [100, 100, 100],
                                'units' => ['ALUMNI', 'UVAAI'],
                                'action_plans' => ['Conduct Alumni Homecoming/Reunion activities.'],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}