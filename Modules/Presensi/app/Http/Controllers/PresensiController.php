<?php

namespace Modules\Presensi\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Modules\Presensi\Models\Attendance;

class PresensiController extends Controller
{
    public function index($projectId)
    {
        return Inertia::render('Presensi/PresensiIndex', [
            'projectId' => $projectId,
        ]);
    }

    public function getAttendances($projectId)
    {
        try {
            $attendances = Attendance::where('project_id', $projectId)->get();
            return response()->json($attendances);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengambil data presensi: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request, $projectId)
    {
        try {
            $data = $request->validate([
                'date' => 'required|date',
                'start_time' => 'required',
                'end_time' => 'required',
                'type' => 'required|string|max:50',
            ]);

            $attendance = Attendance::create([
                'project_id' => $projectId,
                'date' => $data['date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'type' => $data['type'],
            ]);

            return response()->json([
                'message' => 'Presensi berhasil disimpan.',
                'data' => $attendance,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Gagal menyimpan presensi ke server.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $projectId, $attendanceId)
    {
        try {
            $data = $request->validate([
                'date' => 'required|date',
                'start_time' => 'required',
                'end_time' => 'required',
                'type' => 'required|string|max:50',
            ]);

            $attendance = Attendance::where('project_id', $projectId)
                ->where('id', $attendanceId)
                ->first();

            if (!$attendance) {
                return response()->json(['error' => 'Presensi tidak ditemukan.'], 404);
            }

            $attendance->update($data);

            return response()->json([
                'message' => 'Presensi berhasil diperbarui.',
                'data' => $attendance,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Gagal memperbarui presensi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function delete($projectId, $attendanceId)
    {
        try {
            $attendance = Attendance::where('project_id', $projectId)
                ->where('id', $attendanceId)
                ->first();

            if (!$attendance) {
                return response()->json(['error' => 'Presensi tidak ditemukan.'], 404);
            }

            $attendance->delete();
            return response()->json(['message' => 'Presensi berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menghapus presensi: ' . $e->getMessage()], 500);
        }
    }
}
