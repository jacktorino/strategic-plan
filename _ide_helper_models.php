<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $label
 * @property int $start_year
 * @property int $end_year
 * @property bool $is_current
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\KpiTarget> $kpiTargets
 * @property-read int|null $kpi_targets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MonthlySubmission> $monthlySubmissions
 * @property-read int|null $monthly_submissions_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereEndYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereIsCurrent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereStartYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AcademicYear whereUpdatedAt($value)
 */
	class AcademicYear extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $kpi_id
 * @property string $description
 * @property int $sort_order
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Kpi $kpi
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Unit> $units
 * @property-read int|null $units_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan whereKpiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActionPlan whereUpdatedAt($value)
 */
	class ActionPlan extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $sub_area_id
 * @property string $code
 * @property string $description
 * @property int $sort_order
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActionPlan> $actionPlans
 * @property-read int|null $action_plans_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MonthlySubmission> $monthlySubmissions
 * @property-read int|null $monthly_submissions_count
 * @property-read \App\Models\KraSubArea $subArea
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\KpiTarget> $targets
 * @property-read int|null $targets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Unit> $units
 * @property-read int|null $units_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereSubAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kpi whereUpdatedAt($value)
 */
	class Kpi extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $kpi_id
 * @property int $academic_year_id
 * @property numeric $target_percentage
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\AcademicYear $academicYear
 * @property-read \App\Models\Kpi $kpi
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget whereAcademicYearId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget whereKpiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget whereTargetPercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KpiTarget whereUpdatedAt($value)
 */
	class KpiTarget extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $number
 * @property string $title
 * @property string|null $reference
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\KraSubArea> $subAreas
 * @property-read int|null $sub_areas_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra whereNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Kra whereUpdatedAt($value)
 */
	class Kra extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $kra_id
 * @property string $code
 * @property string $title
 * @property int $sort_order
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Kpi> $kpis
 * @property-read int|null $kpis_count
 * @property-read \App\Models\Kra $kra
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereKraId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|KraSubArea whereUpdatedAt($value)
 */
	class KraSubArea extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $kpi_id
 * @property int $unit_id
 * @property int $academic_year_id
 * @property int $year
 * @property int $month
 * @property numeric $percentage_achieved
 * @property string|null $remarks
 * @property string $status
 * @property int|null $submitted_by
 * @property \Carbon\CarbonImmutable|null $submitted_at
 * @property int|null $reviewed_by
 * @property \Carbon\CarbonImmutable|null $reviewed_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\AcademicYear $academicYear
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MonthlySubmissionAttachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read \App\Models\Kpi $kpi
 * @property-read \App\Models\User|null $reviewedBy
 * @property-read \App\Models\User|null $submittedBy
 * @property-read \App\Models\Unit $unit
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereAcademicYearId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereKpiId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission wherePercentageAchieved($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereRemarks($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereReviewedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereReviewedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereSubmittedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereSubmittedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereUnitId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmission whereYear($value)
 */
	class MonthlySubmission extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $monthly_submission_id
 * @property string $original_filename
 * @property string $path
 * @property string|null $mime_type
 * @property int|null $size_bytes
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\MonthlySubmission $monthlySubmission
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereMonthlySubmissionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereOriginalFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereSizeBytes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MonthlySubmissionAttachment whereUpdatedAt($value)
 */
	class MonthlySubmissionAttachment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $type
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActionPlan> $actionPlans
 * @property-read int|null $action_plans_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Kpi> $kpis
 * @property-read int|null $kpis_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MonthlySubmission> $monthlySubmissions
 * @property-read int|null $monthly_submissions_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Unit whereUpdatedAt($value)
 */
	class Unit extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string $status
 * @property Carbon|null $approved_at
 * @property int|null $approved_by
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $role
 * @property string|null $responsible_unit
 * @property string|null $avatar
 * @property-read User|null $approver
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Passkeys\Passkey> $passkeys
 * @property-read int|null $passkeys_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereResponsibleUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorRecoveryCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Laravel\Fortify\Contracts\PasskeyUser, \Laravel\Passkeys\Contracts\PasskeyUser {}
}

