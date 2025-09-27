<?php

namespace Modules\Pekerja\Repositories\Eloquent;

use Modules\Pekerja\Models\Karyawan;

class KaryawanRepository
{
    public function all()
    {
        return Karyawan::all();
    }

    public function find($id)
    {
        return Karyawan::findOrFail($id);
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
        $query = Karyawan::query();

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

    public function delete($id)
    {
        return Karyawan::destroy($id);
    }
}