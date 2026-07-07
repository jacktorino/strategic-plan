<?php

namespace App\Support;

class ResponsibleUnits
{
    public const GROUPS = [
        'Academic Units' => ['CAHS', 'CAS', 'CBA', 'CCJE', 'COED', 'CETA', 'COME', 'GLS'],
        'Academic Support' => [
            'CPAD', 'QMSO', 'FMD', 'ICTD', 'FAD', 'HRD', 'CRI', 'COMEX',
            'IAD', 'SASC', 'ARC', 'ACD', 'CIE', 'DPIA', 'IQA', 'CPARC',
            'SRMD', 'SSD', 'CTESD',
        ],
        'Satellite Campuses' => ['PARDO', 'MINGLANILLA', 'TOLEDO', 'DALAGUETE'],
    ];

    public static function allValidValues(): array
    {
        $values = [];
        foreach (self::GROUPS as $group => $units) {
            $values[] = "All {$group}";
            array_push($values, ...$units);
        }
        return $values;
    }

    /** Which group (if any) a given unit code belongs to. */
    public static function groupFor(string $unitCode): ?string
    {
        foreach (self::GROUPS as $group => $units) {
            if (in_array($unitCode, $units, true)) {
                return $group;
            }
        }
        return null;
    }

    /**
     * Does a responsible_units assignment (e.g. ["ICTD", "All Academic Units"])
     * apply to a given unit code? True if the code appears directly, or if the
     * unit's own group was assigned wholesale via "All {Group}".
     */
    public static function assignmentIncludesUnit(array $responsibleUnits, string $unitCode): bool
    {
        if (in_array($unitCode, $responsibleUnits, true)) {
            return true;
        }

        $group = self::groupFor($unitCode);
        return $group !== null && in_array("All {$group}", $responsibleUnits, true);
    }

    public static function allUnitCodes(): array
{
    return collect(self::GROUPS)->flatten()->all(); // 30 real codes, no "All {Group}" labels
}
}