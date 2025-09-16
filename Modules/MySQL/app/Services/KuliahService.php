<?php

namespace Modules\MySQL\Services;

use Modules\MySQL\Models\Kuliah;
use Modules\MySQL\Models\Dosen;
use Modules\MySQL\Models\Mahasiswa;
use Modules\MySQL\Models\MataKuliah;
use Modules\MySQL\Repositories\Eloquent\DosenRepository;
use Modules\MySQL\Repositories\Eloquent\KuliahRepository;
use Modules\MySQL\Repositories\Eloquent\MahasiswaRepository;
use Modules\MySQL\Repositories\Eloquent\MataKuliahRepository;

class KuliahService
{
    protected $kuliahRepository;
    protected $dosenRepository;
    protected $mahasiswaRepository;
    protected $mataKuliahRepository;

    public function __construct(KuliahRepository $kuliahRepository, DosenRepository $dosenRepository, MahasiswaRepository $mahasiswaRepository, MataKuliahRepository $mataKuliahRepository)
    {
        $this->kuliahRepository = $kuliahRepository;
        $this->dosenRepository = $dosenRepository;
        $this->mahasiswaRepository = $mahasiswaRepository;
        $this->mataKuliahRepository = $mataKuliahRepository;
    }

    public function createKuliah(array $data)
    {
        $payload = [
            'dosen_id' => Dosen::where('nama', $data['dosen'])->value('id'),
            'mahasiswa_id' => Mahasiswa::where('nama', $data['mahasiswa'])->value('id'),
            'mata_kuliah_id' => MataKuliah::where('nama', $data['mataKuliah'])->value('id'),
            'nilai' => (int) $data['nilai'],
        ];

        return $this->kuliahRepository->create($payload);
    }

    public function getKuliah($id)
    {
        return Kuliah::query()
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
            )
            ->where('kuliah.id', $id)
            ->first();
    }

    public function getKuliahPaginated($request)
    {
        return $this->kuliahRepository->getFilteredSortedAndSearched($request);
    }

    public function updateKuliah(Kuliah $kuliah, array $data)
    {
        $payload = [
            'dosen_id' => Dosen::where('nama', $data['dosen'])->value('id'),
            'mahasiswa_id' => Mahasiswa::where('nama', $data['mahasiswa'])->value('id'),
            'mata_kuliah_id' => MataKuliah::where('nama', $data['mataKuliah'])->value('id'),
            'nilai' => (int) $data['nilai'],
        ];

        return $this->kuliahRepository->update($kuliah, $payload);
    }

    public function deleteKuliah(Kuliah $kuliah)
    {
        $this->kuliahRepository->delete($kuliah->id);
    }

    public function getAllKuliahFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
        ];
    }

    public function getAllOptions()
    {
        return [
            'dosen' => $this->dosenRepository->getAllDosenNoAll(),
            'mahasiswa' => $this->mahasiswaRepository->getAllMahasiswaNoAll(),
            'mataKuliah' => $this->mataKuliahRepository->getAllMataKuliahNoAll(),
        ];
    }
}
