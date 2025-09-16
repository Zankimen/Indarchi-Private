<?php

namespace Modules\MySQL\Repositories\Eloquent;

use Modules\MySQL\Models\Dosen;
use Modules\MySQL\Repositories\Contracts\DosenRepositoryInterface;

class DosenRepository implements DosenRepositoryInterface
{
    public function all()
    {
        return Dosen::all();
    }

    public function find($id)
    {
        return Dosen::findOrFail($id);
    }

    public function create(array $data)
    {
        return Dosen::create($data);
    }

    public function update(Dosen $doses, array $data)
    {
        return $doses->update($data);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $query = Dosen::query();

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['nip', 'nama', 'alamat', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'nip';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nip) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(nama) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(alamat) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function delete($id)
    {
        return Dosen::destroy($id);
    }

    public function getAllDosenNoAll()
    {
        return Dosen::select('nama')
            ->distinct()
            ->whereNotNull('nama')
            ->where('nama', '!=', '')
            ->orderBy('nama')
            ->get()
            ->pluck('nama');
    }
}