<?php

use Illuminate\Support\Facades\Route;
use Modules\Presensi\Http\Controllers\PresensiController;

Route::middleware(['web', 'auth', 'share.menu:project', 'share.menu:project'])->group(function () {
    Route::prefix('/projects')->group(function () {
        Route::get('/{project_id}/presensi', [PresensiController::class, 'index'])->name('presensi.index');

                // Attendance Schedule (jadwal kerja)
        Route::get('/{project_id}/attendances', [PresensiController::class, 'getAttendances'])->name('attendances.get');
        Route::post('/{project_id}/attendances', [PresensiController::class, 'store'])->name('attendances.store');
        Route::put('/{project_id}/attendances/{attendanceId}', [PresensiController::class, 'update'])->name('attendances.update');
        Route::delete('/{project_id}/attendances/{attendanceId}', [PresensiController::class, 'delete'])->name('attendances.delete');

                // Pekerja & Presensi Individual (API)
                Route::get('/{project_id}/pekerja-list', [PresensiController::class, 'getPekerja'])->name('pekerja-list.get');
                Route::get('/{project_id}/presensi-pekerja', [PresensiController::class, 'getPresensiPekerja'])->name('presensi-pekerja.get');
                Route::post('/{project_id}/presensi-pekerja', [PresensiController::class, 'markPresensi'])->name('presensi-pekerja.mark');
        Route::get('/{project_id}/attendances/{attendanceId}/getAttendancesworkers', [PresensiController::class, 'getAttendancesworkers']);
        Route::patch('/{projectId}/attendances/{attendanceId}/workers/{userId}', [PresensiController::class, 'updateWorkerStatus'])->name('workers.update');
    });
});
