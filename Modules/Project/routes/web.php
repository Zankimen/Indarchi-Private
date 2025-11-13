<?php

use Illuminate\Support\Facades\Route;
use Modules\Project\Http\Controllers\ProjectController;

Route::middleware(['auth'])

    ->group(function () {
        Route::prefix('dashboard/projects')
            ->as('projects.')

            ->middleware(['share.menu:dashboard', 'require.permission:dashboard.project.view', 'reset.project.team'])
            ->group(function () {
                Route::get('/', [ProjectController::class, 'index'])->name('index');
            })

            ->middleware(['require.permission:dashboard.project.manage', 'reset.project.team'])
            ->group(function () {
                Route::get('/create', [ProjectController::class, 'create'])->name('create');
                Route::post('/', [ProjectController::class, 'store'])->name('store');
            });
    })

    ->group(function () {
        Route::prefix('projects')
            ->as('projects.')

            ->middleware(['share.menu:project', 'require.permission:project.project.view', 'set.project.team'])
            ->group(function () {
                Route::get('/{project}/informasi', [ProjectController::class, 'show'])->name('show');
            })

            ->middleware(['require.permission:project.project.manage', 'set.project.team'])
            ->group(function () {
                Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
                Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
                Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');
            });
    });
