<?php

use Illuminate\Support\Facades\Route;
use Modules\Timeline\Http\Controllers\TimelineController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('timelines', TimelineController::class)->names('timeline');
});
