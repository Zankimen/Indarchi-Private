<?php

use Illuminate\Support\Facades\Route;
use Modules\Peran\Http\Controllers\PeranController;
use Modules\Peran\Http\Controllers\PeranProjectController;

Route::middleware(['auth'])

    ->group(function () {
        Route::prefix('dashboard/peran')
            ->as('peran')
            ->middleware(['share.menu:dashboard', 'require.permission:dashboard.role.view', 'reset.project.team'])
            ->group(function () {
                Route::get('/', [PeranController::class, 'index'])->name('peran.index');
                Route::get('/{peran}', [PeranController::class, 'details'])->name('peran.details');
            })

            ->middleware(['require.permission:dashboard.role.manage', 'reset.project.team'])
            ->group(function () {
                Route::post('/add', [PeranController::class, 'create'])->name('peran.create');
                Route::put('/edit/{peran}', [PeranController::class, 'update'])->name('peran.update');
                Route::delete('/{peran}', [PeranController::class, 'delete'])->name('peran.delete');
            });
    })

    ->group(function () {
        Route::prefix('projects')
            ->as('peran.projects')
            ->middleware(['share.menu:project', 'require.permission:project.role.view', 'set.project.team'])
            ->group(function () {
                Route::get('/{project_id}/peran', [PeranProjectController::class, 'index'])->name('peran.project.index');
                Route::get('/{project_id}/peran/{peran_id}', [PeranProjectController::class, 'details'])->name('peran.project.details');

                // Route untuk create dan edit dengan permission manage
                Route::middleware(['require.permission:project.role.manage'])->group(function () {
                    Route::post('/{project_id}/peran', [PeranProjectController::class, 'create'])->name('peran.project.create');
                    Route::put('/{project_id}/peran/{peran_id}/edit', [PeranProjectController::class, 'update'])->name('peran.project.update');
                    Route::delete('/{project_id}/peran/{peran_id}', [PeranProjectController::class, 'delete'])->name('peran.project.delete');
                });
            });
    });
