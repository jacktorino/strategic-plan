# KRA / KPI Tracking Schema

## Hierarchy (mirrors the strategic plan sheet)

```
key_result_areas        (KRA 1, KRA 2, ... "number", "title", "reference")
  └─ kra_sub_areas       (1.1 Governance, 1.2 Leadership, ... "code", "title")
       └─ key_performance_indicators   (1.1.1, 1.1.2, ... "code", "description")
            ├─ kpi_targets              (target % per academic year — was the AY columns)
            ├─ kpi_unit (pivot)         (responsible unit(s) for the KPI as a whole)
            ├─ action_plans             (the "INNOVATIVE ACTION PLAN" bullets)
            │    └─ action_plan_unit (pivot)  (unit(s) for that specific action, if narrower)
            └─ monthly_submissions      (NEW — replaces one % per year with one % per month)
                 └─ monthly_submission_attachments (optional evidence uploads)
```

## Why targets and submissions are separate tables

The original sheet has one percentage per KPI per academic year (e.g. `1.8.5` ramps
20% → 50% → 100%). That's a **target**, not a measurement — it says what "done"
looks like for that year, not what's actually been achieved this month.

- `kpi_targets` keeps that yearly target (one row per KPI per academic year).
- `monthly_submissions` is the new table: a unit reports its actual
  percentage-achieved every month. Multiple months roll up into a year, and
  the year's submissions are compared against `kpi_targets` for that KPI/year.

## How this maps to the routes already added

- Sidebar `/reports/kras/{code}` → look up `kra_sub_areas` by `code`, then show
  its `key_performance_indicators`, each with its latest `monthly_submissions`
  and the `kpi_targets` for the currently selected academic year.
- Header `/reports/monthly?year=&month=` → filter `monthly_submissions` by
  `year` and `month` across all KPIs/units, typically grouped back up by KRA
  for a president-level overview.

## Suggested aggregate for "year progress"

Since there's no longer a single yearly percentage stored directly, compute it
when needed rather than storing it, e.g. an average of that KPI's monthly
submissions within the academic year's date range, or "latest submitted
month's value" if you want a snapshot rather than an average. Which one is
right depends on whether a KPI's progress is cumulative (e.g. "% of print
acquisitions completed") or a recurring monthly compliance check (e.g. "%
response to feedback within 7 days") — worth deciding per-KPI rather than
globally, possibly with a `rollup_method` enum column on
`key_performance_indicators` (`average` vs `latest`) if both types exist in
your data.

## Status workflow on monthly_submissions

`draft → submitted → approved | rejected`

This lets a unit save a submission before finalizing it, and gives admins/
the president an approval step before a number counts toward official
reporting — useful given the multiple review layers implied by
`role:admin` / `role:staff` / `role:president` in your route file.
