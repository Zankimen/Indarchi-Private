<?php

namespace Modules\Pekerja\Repositories\Eloquent;

use Modules\Pekerja\Models\Karyawan;

class KaryawanRepository
{
    public function all()
    {
        return Karyawan::with('user')->get();
    }

    public function find($id)
    {
        return Karyawan::with('user')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Karyawan::create($data);
    }

    public function update(Karyawan $karyawan, array $data)
    {
        return $karyawan->update($data);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $query = Karyawan::with('user');

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['nama_karyawan', 'alamat', 'posisi', 'created_at'];

        $sortBy = $request->get('karyawan_sort_by', 'nama_karyawan');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'nama_karyawan';
        }

        $sortDirection = strtolower($request->get('karyawan_sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('karyawan_search')) {
            $search = strtolower($request->karyawan_search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nama_karyawan) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(alamat) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(posisi) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getUnifiedWithUsers($request)
    {
        // For now, get data from karyawan table only until user_id column is added
        $query = Karyawan::select([
            'id',
            'nama_karyawan as name',
            'alamat',
            'posisi',
            'created_at',
            \DB::raw("'' as email") // Empty email for now
        ]);

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['name', 'alamat', 'posisi', 'created_at'];

        $sortBy = $request->get('sort_by', 'name');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        // Map name to nama_karyawan
        if ($sortBy === 'name') {
            $sortBy = 'nama_karyawan';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nama_karyawan) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(alamat) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(posisi) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getUnifiedWithUsersAfterMigration($request)
    {
        // Use this method after user_id column is added
        $query = \App\Models\User::leftJoin('karyawan', 'users.id', '=', 'karyawan.user_id')
            ->select([
                'users.id as id',           
                'users.name',
                'users.email',
                'users.created_at',
                'karyawan.alamat',
                'karyawan.posisi'
            ]);

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['name', 'email', 'alamat', 'posisi', 'created_at'];

        $sortBy = $request->get('sort_by', 'name');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        // Handle sorting with proper table prefixes
        if (in_array($sortBy, ['alamat', 'posisi'])) {
            $query->orderBy('karyawan.' . $sortBy, $sortDirection);
        } else {
            $query->orderBy('users.' . $sortBy, $sortDirection);
        }

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(users.name) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(users.email) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(karyawan.alamat) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(karyawan.posisi) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function delete($id)
    {
        return Karyawan::destroy($id);
    }
}