<?php

use Illuminate\Support\Facades\Route;
use Modules\Peran\Http\Controllers\PeranController;

Route::middleware(['auth', 'share.menu:dashboard', 'require.permission:dashboard.role.view'])
    ->prefix('dashboard/peran')
    ->group(function () {
        Route::get('/', [PeranController::class, 'index'])->name('peran.index');
        Route::get('/{peran}', [PeranController::class, 'details'])->name('peran.details');

        Route::middleware(['auth', 'require.permission:dashboard.role.manage'])
            ->group(function () {
                Route::post('/add', [PeranController::class, 'create'])->name('peran.create');
                Route::put('/edit/{peran}', [PeranController::class, 'update'])->name('peran.update');
                Route::delete('/{peran}', [PeranController::class, 'delete'])->name('peran.delete');
            });
    });