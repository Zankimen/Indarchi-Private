<?php

use Illuminate\Support\Facades\Route;
use Modules\Pekerja\Http\Controllers\PekerjaController;
use Modules\Pekerja\Http\Controllers\PekerjaProjectController;

Route::middleware(['auth'])
    ->group(function () {
        Route::prefix('dashboard/pekerja')
            ->name('pekerja.')
            ->middleware(['share.menu:dashboard', 'require.permission:dashboard.worker.view', 'reset.project.team'])
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
            ->middleware(['share.menu:project', 'set.project.team'])
            ->group(function () {
                Route::get('/{project_id}/pekerja', [PekerjaProjectController::class, 'index'])
                    ->name('pekerja');

                Route::get('/{project_id}/pekerja/{pekerja_id}', [PekerjaProjectController::class, 'details'])
                    ->name('details');

                Route::post('/{project_id}/pekerja/add', [PekerjaProjectController::class, 'addToProject'])
                    ->name('addToProject');

                // Route::post('/{project_id}/pekerja/create', [PekerjaController::class, 'createAndAssign'])
                //     ->name('createAndAssign');

                Route::put('/{project_id}/pekerja/{pekerja_id}/update', [PekerjaProjectController::class, 'updateProjectPeran'])
                    ->name('updateProjectPeran');
            });

    });
