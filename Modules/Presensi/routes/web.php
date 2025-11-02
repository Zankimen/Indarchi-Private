<?php

use Illuminate\Support\Facades\Route;
use Modules\Presensi\Http\Controllers\PresensiController;

Route::middleware(['auth'])
    ->group(function () {
        Route::prefix('/projects')
            ->name('presensi.')
            ->group(function () {
                Route::get('/{project_id}/presensi', [PresensiController::class, 'index'])->name('index');
            });
    });
