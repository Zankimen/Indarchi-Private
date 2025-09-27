<?php

use Illuminate\Support\Facades\Route;
use Modules\Peran\Http\Controllers\PeranController;

// Route::middleware(['auth:sanctum'])->prefix("/role")->name('api.role.')->group(function () {
//     Route::get("/", [PeranController::class, "index"])->name("index");
//     Route::post("/", [PeranController::class, "create"])->name("create");
//     Route::get("/{role}", [PeranController::class, "details"])->name("details");
//     Route::put("/{role}", [PeranController::class, "update"])->name("update");
//     Route::delete("/{role}", [PeranController::class, "delete"])->name("delete");
// });
Route::middleware(['auth:sanctum'])->prefix('peran')->group(function () {
    Route::get('/roles', [PeranController::class, 'index']);
    Route::post('/roles', [PeranController::class, 'create']);
    Route::get('/roles/{role}', [PeranController::class, 'details']);
    Route::put('/roles/{role}', [PeranController::class, 'update']);
    Route::delete('/roles/{role}', [PeranController::class, 'delete']);
    Route::get('/permissions', function () {
        return response()->json(\Spatie\Permission\Models\Permission::all());
    });
});
