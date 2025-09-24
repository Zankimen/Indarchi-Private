<?php

namespace Modules\Pekerja\Services;

use App\Models\User;
use Modules\Pekerja\Repositories\Eloquent\PekerjaRepository;

class PekerjaService
{
    protected PekerjaRepository $pekerjaRepository;

    public function __construct(PekerjaRepository $pekerjaRepository)
    {
        $this->pekerjaRepository = $pekerjaRepository;
    }

    public function createPekerja(array $data)
    {
        return $this->pekerjaRepository->create($data);
    }

    public function getPekerjaPaginated($request)
    {
        return $this->pekerjaRepository->getFilteredSortedAndSearched($request);
    }

    public function updatePekerja(User $pekerja, $request) {
        return $this->pekerjaRepository->update($pekerja, $request);
    }

    public function deletePekerja(User $pekerja) {
        $this->pekerjaRepository->delete($pekerja->id);
    }

    public function getAllPekerjaFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'name' => $request->nama,
            'email' => $request->nip,
        ];
    }
}
