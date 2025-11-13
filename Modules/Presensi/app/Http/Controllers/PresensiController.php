<?php

namespace Modules\Presensi\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Presensi\Models\Attendance;
use Modules\Project\Services\ProjectService;

class PresensiController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index($projectId)
    {
        try {
            return Inertia::render('Presensi/PresensiIndex', [
                'project' => $this->projectService->getProjectById($projectId),
                'projectId' => $projectId,
            ]);
        } catch (\Throwable $e) {
            return back(303)->withErrors(['error' => 'Gagal memuat halaman presensi: ' . $e->getMessage()]);
        }
    }

    public function getAttendances($projectId)
    {
        try {
            $attendances = Attendance::where('project_id', $projectId)->get();

            return response()->json($attendances);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengambil data presensi: ' . $e->getMessage(),
            ], 500);
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

            // Ambil semua pekerja project dan set default status "Absen"
            $projectWorkers = \App\Models\User::whereHas('projects', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            })->get();

            foreach ($projectWorkers as $worker) {
                $attendance->workers()->attach($worker->id, [
                    'project_id' => $projectId,
                    'status' => 'Absen',
                ]);
            }

            return response()->json([
                'message' => 'Presensi berhasil disimpan dan semua pekerja diatur ke status Absen.',
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

            if (! $attendance) {
                return response()->json(['error' => 'Presensi tidak ditemukan.'], 404);
            }

            $attendance->update($data);

            return response()->json([
                'message' => 'Presensi berhasil diperbarui.',
                'data' => $attendance,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Gagal memperbarui presensi: '.$e->getMessage(),
            ], 500);
        }
    }

    public function delete($projectId, $attendanceId)
    {
        try {
            $attendance = Attendance::where('project_id', $projectId)
                ->where('id', $attendanceId)
                ->first();

            if (! $attendance) {
                return response()->json(['error' => 'Presensi tidak ditemukan.'], 404);
            }

            $attendance->delete();

            return response()->json(['message' => 'Presensi berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menghapus presensi: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAttendancesworkers($projectId, $attendanceId)
    {
        $projectWorkers = \App\Models\User::whereHas('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })->get();

        $attendance = \Modules\Presensi\Models\Attendance::with(['workers' => function ($q) {
            $q->select('users.id', 'users.name', 'users.email');
        }])->findOrFail($attendanceId);

        $workers = $projectWorkers->map(function ($worker) use ($attendance) {
            $pivot = $attendance->workers->firstWhere('id', $worker->id);
            return [
                'id' => $worker->id,
                'name' => $worker->name,
                'email' => $worker->email,
                'status' => $pivot ? $pivot->pivot->status : 'Absen',
            ];
        });

        return response()->json([
            'workers' => $workers,
        ]);
    }

    public function updateWorkerStatus($projectId, $attendanceId, $userId, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Hadir,Absen,Izin',
        ]);

        $attendance = Attendance::where('project_id', $projectId)
            ->where('id', $attendanceId)
            ->firstOrFail();

        $isWorkerInProject = \App\Models\User::whereHas('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })->where('id', $userId)->exists();

        if (! $isWorkerInProject) {
            return response()->json(['error' => 'Pekerja tidak terdaftar di project ini.'], 403);
        }

        $attendance->workers()->syncWithoutDetaching([
            $userId => [
                'project_id' => $projectId,
                'status' => $validated['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        return response()->json([
            'message' => 'Status updated successfully',
            'worker' => ['id' => $userId, 'status' => $validated['status']],
        ]);
    }

}
