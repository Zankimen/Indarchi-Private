<?php

use Illuminate\Support\Facades\Route;
use Modules\Project\Http\Controllers\ProjectController;

Route::middleware(['auth'])
    ->group(function () {
        Route::prefix('dashboard/projects')
            ->name('projects.')
            ->group(function () {
                Route::get('/', [ProjectController::class, 'index'])->name('index');

<<<<<<< HEAD
    Route::get('/create', [ProjectController::class, 'create'])->name('create');
    Route::post('/', [ProjectController::class, 'store'])->name('store');
    Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
    Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');
    Route::get('/{project}', [ProjectController::class, 'show'])->name('show');

=======
                Route::post('/', [ProjectController::class, 'store'])->name('store');
>>>>>>> 0b4510b5b6d2f77a40014e199c92c41bf6580c11

                // Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
                // Route::put('/{project}', [ProjectController::class, 'update'])->name('update');

                // Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');

            });
    })
    ->group(function () {
        Route::prefix('projects')
            ->name('projects.')
            ->group(function () {
                Route::get('/{project}/informasi', [ProjectController::class, 'show'])->name('show');
            });
    });
