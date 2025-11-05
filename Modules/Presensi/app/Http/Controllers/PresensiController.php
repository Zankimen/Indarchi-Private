<?php

namespace Modules\Presensi\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Presensi\Models\Attendance;
use Modules\Presensi\Models\Presensi;
use Modules\Pekerja\Services\PekerjaService;

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

    // Get pekerja untuk project tertentu
    public function getPekerja($projectId)
    {
        try {
            $pekerjaService = app(PekerjaService::class);
            $pekerja = $pekerjaService->getPekerjaByProject($projectId);
            
            return response()->json($pekerja);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengambil data pekerja: ' . $e->getMessage()], 500);
        }
    }

    // Get presensi pekerja untuk tanggal tertentu
    public function getPresensiPekerja($projectId, Request $request)
    {
        try {
            $date = $request->query('date');
            
            $presensi = Presensi::where('project_id', $projectId)
                ->where('tanggal', $date)
                ->with('user:id,name')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'user_id' => $item->user_id,
                        'nama' => $item->user->name,
                        'status' => $item->status,
                        'jam_masuk' => $item->jam_masuk,
                        'jam_keluar' => $item->jam_keluar,
                        'keterangan' => $item->keterangan,
                    ];
                });

            return response()->json($presensi);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengambil presensi: ' . $e->getMessage()], 500);
        }
    }

    // Mark kehadiran pekerja
    public function markPresensi(Request $request, $projectId)
    {
        try {
            $data = $request->validate([
                'user_id' => 'required|exists:users,id',
                'tanggal' => 'required|date',
                'status' => 'required|in:hadir,izin,sakit,alpha',
                'jam_masuk' => 'nullable',
                'jam_keluar' => 'nullable',
                'keterangan' => 'nullable|string',
            ]);

            $presensi = Presensi::updateOrCreate(
                [
                    'user_id' => $data['user_id'],
                    'project_id' => $projectId,
                    'tanggal' => $data['tanggal'],
                ],
                [
                    'status' => $data['status'],
                    'jam_masuk' => $data['jam_masuk'] ?? null,
                    'jam_keluar' => $data['jam_keluar'] ?? null,
                    'keterangan' => $data['keterangan'] ?? null,
                ]
            );

            return response()->json([
                'message' => 'Presensi berhasil disimpan.',
                'data' => $presensi->load('user:id,name'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menyimpan presensi: ' . $e->getMessage()
            ], 500);
        }
    }
}
