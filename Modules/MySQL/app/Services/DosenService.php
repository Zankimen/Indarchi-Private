<?php

namespace Modules\MySQL\Services;

use Modules\MySQL\Models\Dosen;
use Modules\MySQL\Repositories\Contracts\DosenRepositoryInterface;

class DosenService
{
    protected DosenRepositoryInterface $dosenRepository;

    public function __construct(DosenRepositoryInterface $dosenRepository)
    {
        $this->dosenRepository = $dosenRepository;
    }

    public function createDosen(array $data)
    {
        return $this->dosenRepository->create($data);
    }

    public function getDosenPaginated($request)
    {
        return $this->dosenRepository->getFilteredSortedAndSearched($request);
    }

    public function updateDosen(Dosen $dosen, $request) {
        return $this->dosenRepository->update($dosen, $request);
    }

    public function deleteDosen(Dosen $dosen) {
        $this->dosenRepository->delete($dosen->id);
    }

    public function getAllDosenFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'nama' => $request->nama,
            'nip' => $request->nip,
            'alamat' => $request->alamat,
        ];
    }
}
