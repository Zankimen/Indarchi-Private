<?php

use Illuminate\Support\Facades\Route;
use Modules\Project\Http\Controllers\ProjectController;

Route::prefix('projects')->name('projects.')->group(function () {
    // GET /projects  → menampilkan daftar project
    Route::get('/', [ProjectController::class, 'index'])->name('index');

    // GET /projects/create  → form tambah project
    Route::get('/create', [ProjectController::class, 'create'])->name('create');

    // POST /projects  → simpan project baru
    Route::post('/', [ProjectController::class, 'store'])->name('store');

    // GET /projects/{project}/edit  → form edit project
    Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');

    // PUT /projects/{project}  → update project
    Route::put('/{project}', [ProjectController::class, 'update'])->name('update');

    // DELETE /projects/{project}  → hapus project
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');
});
