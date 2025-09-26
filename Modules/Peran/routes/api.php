<?php

use Illuminate\Support\Facades\Route;
use Modules\Peran\Http\Controllers\PeranController;

Route::middleware(['auth:sanctum'])->prefix("/role")->name('api.role.')->group(function () {
    Route::get("/", [PeranController::class, "index"])->name("index");
    Route::post("/", [PeranController::class, "create"])->name("create");
    Route::get("/{role}", [PeranController::class, "details"])->name("details");
    Route::put("/{role}", [PeranController::class, "update"])->name("update");
    Route::delete("/{role}", [PeranController::class, "delete"])->name("delete");
});
