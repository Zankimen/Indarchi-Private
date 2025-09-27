<?php

use Illuminate\Support\Facades\Route;
use Modules\Peran\Http\Controllers\PeranController;

// Route::middleware(['auth'])->prefix("/role")->name('role.')->group(function () {
//     Route::get("/", [PeranController::class, "index"])->name("index");

//     Route::get("/add", [PeranController::class, "addPage"])->name("add");
//     Route::post("/add", [PeranController::class, "create"])->name("create");

//     Route::get("/edit/{role}", [PeranController::class, "editPage"])->name("edit");
//     Route::put("/edit/{role}", [PeranController::class, "update"])->name("update");

//     Route::get("/{role}", [PeranController::class, "details"])->name("details");
//     Route::delete("/{role}", [PeranController::class, "delete"])->name("delete");
// });
Route::middleware(['web', 'auth'])->prefix('role')->group(function () {
    Route::get('/', [PeranController::class, 'index'])->name('role.index');
    Route::get('/add', [PeranController::class, 'addPage'])->name('role.add.page');
    Route::post('/add', [PeranController::class, 'create'])->name('role.create');
    Route::get('/{role}', [PeranController::class, 'details'])->name('role.details');
    Route::get('/edit/{role}', [PeranController::class, 'editPage'])->name('role.edit.page');
    Route::put('/edit/{role}', [PeranController::class, 'update'])->name('role.update');
    Route::delete('/{role}', [PeranController::class, 'delete'])->name('role.delete');
});
