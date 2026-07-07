<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

// President Imports
use App\Http\Controllers\President\KraController;
use App\Http\Controllers\President\KpiController;
use App\Http\Controllers\President\ActionPlanController;
use App\Http\Controllers\President\UnitController;
use App\Http\Controllers\President\ReportController;
use App\Http\Controllers\President\AcademicYearController;

// Admin Imports
use App\Http\Controllers\Admin\AdminKraController;
use App\Http\Controllers\Admin\AdminKpiController;
use App\Http\Controllers\Admin\AdminActionPlanController;
use App\Http\Controllers\Admin\AdminUnitController;
use App\Http\Controllers\Admin\KpiSubmissionController as AdminSubmissionController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminAcademicYearController;

// Staff / Unit Imports
use App\Http\Controllers\Unit\UnitKpiController;
use App\Http\Controllers\Unit\UnitActionPlanController;
use App\Http\Controllers\Unit\UnitKpiSubmissionController;
use App\Http\Controllers\Unit\UnitReportController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Shared Dashboard route
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // 1. PRESIDENT ROUTES
    Route::middleware('role:president')->group(function () {
      
        Route::get('kras', [KraController::class, 'index'])->name('kras.index');
        Route::get('kpis', [KpiController::class, 'index'])->name('kpis.index');
        Route::get('action-plans', [ActionPlanController::class, 'index'])->name('action-plans.index');
        Route::get('units', [UnitController::class, 'index'])->name('units.index');
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('academic-years', [AcademicYearController::class, 'index'])->name('academic-years.index');
    });

    // 2. ADMIN ROUTES
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('kras', [AdminKraController::class, 'index'])->name('kras');
        Route::post('/kras', [AdminKraController::class, 'store'])->name('kras.store');
        Route::get('kpis', [AdminKpiController::class, 'index'])->name('kpis');
        Route::post('/kpis', [AdminKpiController::class, 'store'])->name('kpis.store');
        Route::get('action-plans', [AdminActionPlanController::class, 'index'])->name('action-plans');
        Route::get('units', [AdminUnitController::class, 'index'])->name('units');
        Route::get('kpi-submissions', [AdminSubmissionController::class, 'index'])->name('kpi-submissions');
        Route::get('reports', [AdminReportController::class, 'index'])->name('reports');
        Route::get('academic-years', [AdminAcademicYearController::class, 'index'])->name('academic-years');
    });

    // 3. STAFF / UNIT ROUTES
    Route::prefix('my')->name('my.')->middleware('role:staff')->group(function () {
        Route::get('kpis', [UnitKpiController::class, 'index'])->name('kpis');
        Route::get('action-plans', [UnitActionPlanController::class, 'index'])->name('action-plans');
        Route::get('kpi-submissions/create', [UnitKpiSubmissionController::class, 'create'])->name('kpi-submissions.create');
        Route::get('reports', [UnitReportController::class, 'index'])->name('reports');
    });
});

require __DIR__.'/settings.php';