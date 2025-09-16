<?php

use Illuminate\Support\Facades\Route;
use Modules\MySQL\Http\Controllers\DosenController;
use Modules\MySQL\Http\Controllers\KuliahController;
use Modules\MySQL\Http\Controllers\MahasiswaController;
use Modules\MySQL\Http\Controllers\MataKuliahController;

Route::middleware(['auth'])->prefix("/mysql/mahasiswa")->name('mysql.mahasiswa.')->group(function () {
    Route::get("/", [MahasiswaController::class, "index"])->name("index");

    Route::get("/add", [MahasiswaController::class, "addPage"])->name("add");
    Route::post("/add", [MahasiswaController::class, "create"])->name("create");

    Route::get("/edit/{mahasiswa}", [MahasiswaController::class, "editPage"])->name("edit");
    Route::put("/edit/{mahasiswa}", [MahasiswaController::class, "update"])->name("update");

    Route::get("/{mahasiswa}", [MahasiswaController::class, "details"])->name("details");
    Route::delete("/{mahasiswa}", [MahasiswaController::class, "delete"])->name("delete");
});

Route::prefix("/mysql/dosen")->name('mysql.dosen.')->group(function () {
    Route::get("/", [DosenController::class, "index"])->name("index");

    Route::get("/add", [DosenController::class, "addPage"])->name("add");
    Route::post("/add", [DosenController::class, "create"])->name("create");

    Route::get("/edit/{dosen}", [DosenController::class, "editPage"])->name("edit");
    Route::put("/edit/{dosen}", [DosenController::class, "update"])->name("update");

    Route::get("/{dosen}", [DosenController::class, "details"])->name("details");
    Route::delete("/{dosen}", [DosenController::class, "delete"])->name("delete");
});

Route::prefix("/mysql/matakuliah")->name('mysql.mataKuliah.')->group(function () {
    Route::get("/", [MataKuliahController::class, "index"])->name("index");

    Route::get("/add", [MataKuliahController::class, "addPage"])->name("add");
    Route::post("/add", [MataKuliahController::class, "create"])->name("create");

    Route::get("/edit/{mataKuliah}", [MataKuliahController::class, "editPage"])->name("edit");
    Route::put("/edit/{mataKuliah}", [MataKuliahController::class, "update"])->name("update");

    Route::get("/{mataKuliah}", [MataKuliahController::class, "details"])->name("details");
    Route::delete("/{mataKuliah}", [MataKuliahController::class, "delete"])->name("delete");
});

Route::prefix("/mysql/kuliah")->name('mysql.kuliah.')->group(function () {
    Route::get("/", [KuliahController::class, "index"])->name("index");

    Route::get("/add", [KuliahController::class, "addPage"])->name("add");
    Route::post("/add", [KuliahController::class, "create"])->name("create");

    Route::get("/edit/{kuliah}", [KuliahController::class, "editPage"])->name("edit");
    Route::put("/edit/{kuliah}", [KuliahController::class, "update"])->name("update");

    Route::get("/{kuliah}", [KuliahController::class, "details"])->name("details");
    Route::delete("/{kuliah}", [KuliahController::class, "delete"])->name("delete");
});