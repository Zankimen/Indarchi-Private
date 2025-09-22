<?php

use Illuminate\Support\Facades\Route;
use Modules\Pekerja\Http\Controllers\PekerjaController;

Route::middleware(['auth'])->prefix("/pekerja")->name('pekerja.')->group(function () {
    Route::get("/", [PekerjaController::class, "index"])->name("index");

    Route::get("/add", [PekerjaController::class, "addPage"])->name("add");
    Route::post("/add", [PekerjaController::class, "create"])->name("create");

    Route::get("/edit/{pekerja}", [PekerjaController::class, "editPage"])->name("edit");
    Route::put("/edit/{pekerja}", [PekerjaController::class, "update"])->name("update");

    Route::get("/{pekerja}", [PekerjaController::class, "details"])->name("details");
    Route::delete("/{pekerja}", [PekerjaController::class, "delete"])->name("delete");
});