<?php

use Illuminate\Support\Facades\Route;
use Modules\Peran\Http\Controllers\PeranController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('perans', PeranController::class)->names('peran');
});
