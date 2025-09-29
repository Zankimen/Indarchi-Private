<?php

use Illuminate\Support\Facades\Route;
use Modules\Pekerja\Http\Controllers\PekerjaController;

Route::middleware(['auth'])->prefix("/pekerja")->name('pekerja.')->group(function () {
    Route::get("/", [PekerjaController::class, "index"])->name("index");

    Route::get("/add", [PekerjaController::class, "create"])->name("add");
    Route::post("/add", [PekerjaController::class, "store"])->name("store");

    Route::get("/{user_id}/edit", [PekerjaController::class, "edit"])->name("edit");
    Route::put("/{user_id}", [PekerjaController::class, "update"])->name("update");

    Route::delete("/{id}", [PekerjaController::class, "destroy"])->name("delete");

    // ⬇️ taruh paling bawah biar tidak bentrok
    Route::get("/{id}", [PekerjaController::class, "details"])->name("details");
});
