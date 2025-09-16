<?php

namespace Modules\MySQL\Services;

use Modules\MySQL\Models\Mahasiswa;
use Modules\MySQL\Repositories\Contracts\MahasiswaRepositoryInterface;

class MahasiswaService
{
    protected $mahasiswaRepository;

    public function __construct(MahasiswaRepositoryInterface $mahasiswaRepository)
    {
        $this->mahasiswaRepository = $mahasiswaRepository;
    }

    public function createMahasiswa(array $data)
    {
        return $this->mahasiswaRepository->create($data);
    }

    public function getMahasiswaPaginated($request)
    {
        return $this->mahasiswaRepository->getFilteredSortedAndSearched($request);
    }

    public function updateMahasiswa(Mahasiswa $mahasiswa, $request) {
        return $this->mahasiswaRepository->update($mahasiswa, $request);
    }

    public function deleteMahasiswa(Mahasiswa $mahasiswa) {
        $this->mahasiswaRepository->delete($mahasiswa->id);
    }

    public function getAllMahasiswaFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'nama' => $request->nama,
            'nim' => $request->nim,
            'alamat' => $request->alamat,
        ];
    }
}
