<?php

use Illuminate\Support\Facades\Route;
use Modules\Timeline\Http\Controllers\TimelineController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('timelines', TimelineController::class)->names('timeline');
});
