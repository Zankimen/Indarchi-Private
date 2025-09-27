<?php

namespace Modules\Pekerja\Services;

use App\Models\User;
use Modules\Pekerja\Repositories\Eloquent\PekerjaRepository;
use Modules\Pekerja\Repositories\Eloquent\KaryawanRepository;

class PekerjaService
{
    protected PekerjaRepository $pekerjaRepository;
    protected KaryawanRepository $karyawanRepository;

    public function __construct(PekerjaRepository $pekerjaRepository, KaryawanRepository $karyawanRepository)
    {
        $this->pekerjaRepository = $pekerjaRepository;
        $this->karyawanRepository = $karyawanRepository;
    }

    public function createPekerja(array $data)
    {
        return $this->pekerjaRepository->create($data);
    }

    public function createKaryawan(array $data)
    {
        return $this->karyawanRepository->create($data);
    }

    public function getPekerjaPaginated($request)
    {
        return $this->pekerjaRepository->getFilteredSortedAndSearched($request);
    }

    public function getKaryawanPaginated($request)
    {
        return $this->karyawanRepository->getFilteredSortedAndSearched($request);
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
            'karyawan_search' => $request->karyawan_search,
            'karyawan_sort_by' => $request->karyawan_sort_by,
            'karyawan_sort_direction' => $request->karyawan_sort_direction,
            'name' => $request->nama,
            'email' => $request->nip,
        ];
    }
}