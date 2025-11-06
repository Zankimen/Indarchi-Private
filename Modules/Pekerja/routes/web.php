<?php

use Illuminate\Support\Facades\Route;
use Modules\Pekerja\Http\Controllers\PekerjaController;

Route::middleware(['auth'])
    ->group(function () {
        Route::prefix('dashboard/pekerja')
            ->name('pekerja.')
            ->middleware(['share.menu:dashboard', 'require.permission:dashboard.worker.view'])
            ->group(function () {
                Route::get('/', [PekerjaController::class, 'index'])->name('index');
                Route::get('/{id}/edit', [PekerjaController::class, 'edit'])->name('edit');
                Route::get('/{id}', [PekerjaController::class, 'details'])->name('details');

                Route::middleware(['require.permission:dashboard.worker.manage'])->group(function () {
                    Route::post('/', [PekerjaController::class, 'create'])->name('create');
                    Route::put('/{id}', [PekerjaController::class, 'update'])->name('update');
                    Route::delete('/{id}', [PekerjaController::class, 'destroy'])->name('delete');
                });
            });

        Route::prefix('projects')
            ->name('pekerja.projects.')
            ->middleware('share.menu:project')
            ->group(function () {
                Route::get('/{project_id}/pekerja', [PekerjaController::class, 'project'])
                    ->name('pekerja');

                Route::post('/{project_id}/pekerja/add', [PekerjaController::class, 'addToProject'])
                    ->name('addToProject');

                Route::post('/{project_id}/pekerja/create', [PekerjaController::class, 'createAndAssign'])
                    ->name('createAndAssign');

                Route::get('/{project_id}/pekerja/{pekerja_id}', [PekerjaController::class, 'showInProject'])
                    ->name('showInProject');

                Route::put('/{project_id}/pekerja/{pekerja_id}/update', [PekerjaController::class, 'updateRoleInProject'])
                    ->name('updateRoleInProject');

            });

    });
