<?php

namespace Modules\Presensi\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Presensi\Models\Attendance;
use Modules\Presensi\Services\PresensiService;
use Modules\Project\Services\ProjectService;

class PresensiController extends Controller
{
    protected ProjectService $projectService;
    protected PresensiService $presensiService;

    public function __construct(ProjectService $projectService, PresensiService $presensiService)
    {
        $this->projectService = $projectService;
        $this->presensiService = $presensiService;
    }

    public function index($projectId)
    {
        try {
            return Inertia::render('Presensi/PresensiIndex', [
                'project' => $this->projectService->getProjectById($projectId),
                'projectId' => $projectId,
            ]);
        } catch (\Throwable $e) {
            return back(303)->withErrors(['error' => 'Gagal memuat halaman presensi: '.$e->getMessage()]);
        }
    }

    public function getAttendances($projectId)
    {
        try {
            $attendances = Attendance::where('project_id', $projectId)->get();

            return response()->json($attendances);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengambil data presensi: '.$e->getMessage(),
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
                'error' => 'Gagal menghapus presensi: '.$e->getMessage(),
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


    public function getPresensiPekerja(Request $request, $projectId)
    {
        try {
            if ($request->has('date')) {
                $date = $request->query('date');

                $attendance = Attendance::where('project_id', $projectId)
                    ->where('date', $date)
                    ->with('workers')
                    ->first();

                if (! $attendance) {
                    return response()->json([]);
                }

                $workers = $attendance->workers->map(function ($w) {
                    return [
                        'user_id' => $w->id,
                        'name' => $w->name,
                        'email' => $w->email ?? null,
                        'status' => $w->pivot->status ?? 'Absen',
                    ];
                })->values();

                return response()->json($workers);
            }

            $userId = $request->query('user_id', auth()->id());
            $year = (int) $request->query('year', date('Y'));
            $month = (int) $request->query('month', date('m'));

            $presensiByDate = $this->presensiService->getMonthlyAttendance($userId, $projectId, $year, $month);

            $presensiByDate = is_array($presensiByDate) ? $presensiByDate : [];

            $merged = [];

            foreach ($presensiByDate as $key => $record) {
                $dateKey = $key;
                if (! $dateKey && isset($record->tanggal)) {
                    $dateKey = $record->tanggal->format('Y-m-d');
                }

                $merged[$dateKey] = [
                    'source' => 'clock',
                    'id' => $record->id ?? null,
                    'tanggal' => $dateKey,
                    'jam_masuk' => isset($record->jam_masuk) && $record->jam_masuk ? (is_string($record->jam_masuk) ? $record->jam_masuk : $record->jam_masuk->format('H:i:s')) : null,
                    'jam_keluar' => isset($record->jam_keluar) && $record->jam_keluar ? (is_string($record->jam_keluar) ? $record->jam_keluar : $record->jam_keluar->format('H:i:s')) : null,
                    'status' => $record->status ?? null,
                    'keterangan' => $record->keterangan ?? null,
                ];
            }

            $schedules = \Modules\Presensi\Models\Attendance::where('project_id', $projectId)
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->with(['workers' => function ($q) use ($userId) {
                    $q->where('users.id', $userId);
                }])
                ->get();

            foreach ($schedules as $sch) {
                $d = null;
                if (isset($sch->date)) {
                    try {
                        $d = (new \Carbon\Carbon($sch->date))->format('Y-m-d');
                    } catch (\Throwable $e) {
                        $d = $sch->date;
                    }
                }

                $pivotStatus = null;
                if ($sch->workers && $sch->workers->first()) {
                    $pivotStatus = $sch->workers->first()->pivot->status ?? null;
                }

                if (isset($merged[$d])) {
                    if (empty($merged[$d]['status']) && $pivotStatus) {
                        $merged[$d]['status'] = $pivotStatus;
                    }
                    $merged[$d]['schedule_id'] = $sch->id;
                } else {
                    $merged[$d] = [
                        'source' => 'schedule',
                        'id' => 'sched_'.$sch->id,
                        'tanggal' => $d,
                        'jam_masuk' => $sch->start_time ?? null,
                        'jam_keluar' => $sch->end_time ?? null,
                        'status' => $pivotStatus ?? null,
                        'keterangan' => null,
                    ];
                }
            }

            $result = array_values($merged);
            usort($result, function ($a, $b) {
                return strtotime($b['tanggal']) <=> strtotime($a['tanggal']);
            });

            return response()->json($result);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Gagal ambil presensi pekerja: '.$e->getMessage()], 500);
        }
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
