<?php

namespace Modules\Presensi\Repositories\Eloquent;

use Modules\Presensi\Models\Presensi;
use Carbon\Carbon;

class PresensiRepository
{
    public function all()
    {
        return Presensi::with(['user', 'project'])->get();
    }

    public function find($id)
    {
        return Presensi::with(['user', 'project'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Presensi::create($data);
    }

    public function update(Presensi $presensi, array $data)
    {
        return $presensi->update($data);
    }

    public function delete($id)
    {
        return Presensi::destroy($id);
    }

    public function findByUserProjectAndDate($userId, $projectId, $date)
    {
        return Presensi::where('user_id', $userId)
            ->where('project_id', $projectId)
            ->where('tanggal', $date)
            ->first();
    }

    public function getMonthlyAttendance($userId, $projectId, $year, $month)
    {
        return Presensi::where('user_id', $userId)
            ->where('project_id', $projectId)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal', 'asc')
            ->get();
    }

    public function getProjectMonthlyAttendance($projectId, $year, $month)
    {
        return Presensi::with(['user'])
            ->where('project_id', $projectId)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal', 'asc')
            ->get();
    }

    public function getFilteredSortedAndSearched($request, $projectId)
    {
        $query = Presensi::with(['user', 'project'])
            ->where('project_id', $projectId);

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['tanggal', 'jam_masuk', 'jam_keluar', 'status', 'created_at'];

        $sortBy = $request->get('sort_by', 'tanggal');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'tanggal';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'desc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        return $query->paginate($perPage)->withQueryString();
    }
}

