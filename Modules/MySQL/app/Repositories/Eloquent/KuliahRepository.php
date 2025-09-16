<?php

namespace Modules\MySQL\Repositories\Eloquent;

use Modules\MySQL\Models\Kuliah;
use Modules\MySQL\Repositories\Contracts\KuliahRepositoryInterface;

class KuliahRepository implements KuliahRepositoryInterface
{
    public function all()
    {
        return Kuliah::all();
    }

    public function find($id)
    {
        return Kuliah::findOrFail($id);
    }

    public function create(array $data)
    {
        return Kuliah::create($data);
    }

    public function update(Kuliah $kuliah, array $data)
    {
        return $kuliah->update($data);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $perPage = $request->input('per_page', 10);

        $query = Kuliah::query()
            ->join('mahasiswa as m', 'kuliah.mahasiswa_id', '=', 'm.id')
            ->join('dosen as d', 'kuliah.dosen_id', '=', 'd.id')
            ->join('mata_kuliah as mk', 'kuliah.mata_kuliah_id', '=', 'mk.id')
            ->select(
                'kuliah.id',
                'kuliah.nilai',
                'kuliah.created_at',
                'kuliah.updated_at',
                'm.nama as mahasiswa',
                'd.nama as dosen',
                'mk.nama as mata_kuliah'
            );

        $allowedSorts = ['mahasiswa', 'dosen', 'mata_kuliah', 'nilai', 'created_at'];
        $sortBy = $request->get('sort_by', 'mahasiswa');
        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'mahasiswa';
        }
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(m.nama) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(d.nama) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(mk.nama) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(kuliah.nilai) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }


    public function delete($id)
    {
        return Kuliah::destroy($id);
    }
}