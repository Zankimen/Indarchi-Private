<?php

namespace Modules\Pekerja\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Modules\Pekerja\Repositories\Eloquent\PekerjaRepository;
use Modules\Pekerja\Repositories\Eloquent\KaryawanRepository;
use Throwable;

class PekerjaService
{
    protected PekerjaRepository $pekerjaRepository;
    protected KaryawanRepository $karyawanRepository;

    public function __construct(PekerjaRepository $pekerjaRepository, KaryawanRepository $karyawanRepository)
    {
        $this->pekerjaRepository = $pekerjaRepository;
        $this->karyawanRepository = $karyawanRepository;
    }

    /**
     * Create a pekerja (user) record.
     */
    public function createPekerja(array $data)
    {
        return $this->pekerjaRepository->create($data);
    }

    /**
     * Create a karyawan record (karyawan table only).
     */
    public function createKaryawan(array $data)
    {
        return $this->karyawanRepository->create($data);
    }

    /**
     * Unified creation: create user + karyawan linked (recommended).
     * This method will be used in controller when CreateKaryawanRequest includes email & password.
     */
    public function createUnifiedKaryawan(array $data)
    {
        // Use the full method that also creates a user and links to karyawan
        return $this->createUnifiedKaryawanWithUser($data);
    }

    /**
     * Full creation (user + karyawan) inside DB transaction.
     */
    public function createUnifiedKaryawanWithUser(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $userData = [
                'name' => $data['nama_karyawan'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ];

            $user = $this->pekerjaRepository->create($userData);

            // Create karyawan linked to user
            $karyawanData = [
                'nama_karyawan' => $data['nama_karyawan'],
                'alamat' => $data['alamat'],
                'posisi' => $data['posisi'],
                'user_id' => $user->id,
            ];

            $this->karyawanRepository->create($karyawanData);

            return $user;
        });
    }

    /**
     * Get unified pekerja paginated (after migration we can join users + karyawan).
     * Make sure KaryawanRepository::getUnifiedWithUsersAfterMigration exists and returns the joined data.
     */
    public function getUnifiedPekerjaPaginated($request)
    {
        return $this->karyawanRepository->getUnifiedWithUsersAfterMigration($request);
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
            'name' => $request->nama,
            'email' => $request->nip,
        ];
    }

    public function updateUnifiedKaryawan($karyawan, array $data)
{
    return DB::transaction(function () use ($karyawan, $data) {
        // Update user
        $userData = [
            'name' => $data['nama_karyawan'],
            'email' => $data['email'],
        ];
        if (!empty($data['password'])) {
            $userData['password'] = Hash::make($data['password']);
        }

        $user = $karyawan->user;
        $this->pekerjaRepository->update($user, $userData);

        // Update karyawan
        $karyawanData = [
            'nama_karyawan' => $data['nama_karyawan'],
            'alamat' => $data['alamat'],
            'posisi' => $data['posisi'],
        ];

        $this->karyawanRepository->update($karyawan, $karyawanData);

        return $karyawan->fresh('user');
    });
}
}
