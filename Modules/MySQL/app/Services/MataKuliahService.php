<?php

namespace Modules\MySQL\Services;

use Modules\MySQL\Models\MataKuliah;
use Modules\MySQL\Repositories\Contracts\MataKuliahRepositoryInterface;

class MataKuliahService
{
    protected $mataKuliahRepository;

    public function __construct(MataKuliahRepositoryInterface $mataKuliahRepository)
    {
        $this->mataKuliahRepository = $mataKuliahRepository;
    }

    public function createMataKuliah(array $data)
    {
        return $this->mataKuliahRepository->create($data);
    }

    public function getMataKuliahPaginated($request)
    {
        return $this->mataKuliahRepository->getFilteredSortedAndSearched($request);
    }

    public function updateMataKuliah(MataKuliah $mataKuliah, $request)
    {
        return $this->mataKuliahRepository->update($mataKuliah, $request);
    }

    public function deleteMataKuliah(MataKuliah $mataKuliah)
    {
        $this->mataKuliahRepository->delete($mataKuliah->id);
    }

    public function getAllMataKuliahFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'nama' => $request->nama,
            'kode' => $request->kode,
            'sks' => $request->sks,
            'semester' => $request->semester,
        ];
    }
}
