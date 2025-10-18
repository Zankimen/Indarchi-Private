<?php

use Illuminate\Support\Facades\Route;
use Modules\Pekerja\Http\Controllers\PekerjaController;

Route::middleware(['auth'])
    ->group(function () {
        Route::prefix('dashboard/pekerja')
            ->name('pekerja.')
            ->group(function () {
                Route::get('/', [PekerjaController::class, 'index'])->name('index');
                Route::post('/', [PekerjaController::class, 'store'])->name('store');
                Route::get('/{id}/edit', [PekerjaController::class, 'edit'])->name('edit');
                Route::put('/{id}', [PekerjaController::class, 'update'])->name('update');
                Route::delete('/{id}', [PekerjaController::class, 'destroy'])->name('delete');
                Route::get('/{id}', [PekerjaController::class, 'details'])->name('details');
            });

       Route::prefix('projects')
    ->name('pekerja.projects.')
    ->middleware(['auth'])
    ->group(function () {
        Route::get('/{project_id}/pekerja', [PekerjaController::class, 'project'])
            ->name('pekerja');

        Route::post('/{project_id}/pekerja/add', [PekerjaController::class, 'addToProject'])
            ->name('addToProject');

        Route::post('/{project_id}/pekerja/create', [PekerjaController::class, 'createAndAssign'])
            ->name('createAndAssign');

    });

    });
