<?php

namespace Modules\MySQL\Repositories\Eloquent;

use Modules\MySQL\Models\Mahasiswa;
use Modules\MySQL\Repositories\Contracts\MahasiswaRepositoryInterface;

class MahasiswaRepository implements MahasiswaRepositoryInterface
{
    public function all()
    {
        return Mahasiswa::all();
    }

    public function find($id)
    {
        return Mahasiswa::findOrFail($id);
    }

    public function create(array $data)
    {
        return Mahasiswa::create($data);
    }

    public function update(Mahasiswa $mahasiswa, array $data) {
        return $mahasiswa->update($data);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $query = Mahasiswa::query();

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['nim', 'nama', 'alamat', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'nim';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nim) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(nama) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(alamat) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function delete($id)
    {
        return Mahasiswa::destroy($id);
    }

    public function getAllMahasiswaNoAll()
    {
        return Mahasiswa::select('nama')
            ->distinct()
            ->whereNotNull('nama')
            ->where('nama', '!=', '')
            ->orderBy('nama')
            ->get()
            ->pluck('nama');
    }
}