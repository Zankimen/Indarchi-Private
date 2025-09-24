<?php

use Illuminate\Support\Facades\Route;
use Modules\Pekerja\Http\Controllers\PekerjaController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('pekerjas', PekerjaController::class)->names('pekerja');
});
