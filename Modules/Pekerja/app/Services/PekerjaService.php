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
        $userData = [
            'name' => $data['nama_karyawan'] ?? $data['name'] ?? '',
            'email' => $data['email'],
            'password' => $data['password'] ?? null,
            'alamat' => $data['alamat'] ?? null,

        ];

        if (empty($userData['password'])) {
            unset($userData['password']);
        }

        $user = $this->pekerjaRepository->create($userData);

        $user->assignRole($data['posisi']);

        return $user;
    }

    public function getPekerjaPaginated($request)
    {
        return $this->pekerjaRepository->getFilteredSortedAndSearched($request);
    }

    public function deletePekerja(User $pekerja)
    {
        $this->pekerjaRepository->delete($pekerja->id);
    }

    public function findPekerjaById(int $id)
    {
        return $this->pekerjaRepository->find($id);
    }

    public function updatePekerja(User $user, array $data)
    {
        $updateData = [
            'name' => $data['nama_karyawan'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'alamat' => $data['alamat'] ?? $user->alamat,
            'posisi' => $data['posisi'] ?? $user->posisi,
        ];

        if (! empty($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        return $this->pekerjaRepository->update($user, $updateData);
    }

    public function getKaryawanPayload(User $user): array
    {
        return [
            'user_id' => $user->id,
            'nama_karyawan' => $user->name,
            'alamat' => $user->alamat,
            'posisi' => $user->posisi,
            'user' => [
                'email' => $user->email,
            ],
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }

    public function getAllPekerjaFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'role' => $request->role,
        ];
    }
}
