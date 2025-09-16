<?php

namespace Modules\MySQL\Repositories\Eloquent;

use Modules\MySQL\Models\MataKuliah;
use Modules\MySQL\Repositories\Contracts\MataKuliahRepositoryInterface;

class MataKuliahRepository implements MataKuliahRepositoryInterface
{
    public function all()
    {
        return MataKuliah::all();
    }

    public function find($id)
    {
        return MataKuliah::findOrFail($id);
    }

    public function create(array $data)
    {
        return MataKuliah::create($data);
    }

    public function update(MataKuliah $mataKuliah, array $data)
    {
        return $mataKuliah->update($data);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $query = MataKuliah::query();

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['kode', 'nama', 'sks', 'semester'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'kode';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(kode) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(nama) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(sks) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(semester) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function delete($id)
    {
        return MataKuliah::destroy($id);
    }

    public function getAllMataKuliahNoAll()
    {
        return MataKuliah::select('nama')
            ->distinct()
            ->whereNotNull('nama')
            ->where('nama', '!=', '')
            ->orderBy('nama')
            ->get()
            ->pluck('nama');
    }
}