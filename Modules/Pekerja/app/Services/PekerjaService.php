<?php

namespace Modules\Pekerja\Services;

use App\Models\User;
use DB;
use Modules\Pekerja\Repositories\PekerjaRepository;

class PekerjaService
{
    protected PekerjaRepository $pekerjaRepository;

    public function __construct(PekerjaRepository $pekerjaRepository)
    {
        $this->pekerjaRepository = $pekerjaRepository;
    }

    public function createPekerja($data)
    {
        return DB::transaction(function () use ($data) {
            $user = $this->pekerjaRepository->create($data);
            $user->assignRole($data['posisi']);

            return $user;
        });
    }

    public function getPekerjasPaginated($request)
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
        return DB::transaction(function () use ($user, $data) {
            $updateData = [
                'name' => $data['name'] ?? $user->name,
                'email' => $data['email'] ?? $user->email,
                'alamat' => $data['alamat'] ?? $user->alamat,
            ];

            if (! empty($data['password'])) {
                $updateData['password'] = bcrypt($data['password']);
            }

            $this->pekerjaRepository->update($user, $updateData);

            if (isset($data['posisi'])) {
                $user->syncRoles([$data['posisi']]);
                cache()->forget('menus_for_user_'.$user->id);
            }

            return $user;
        });
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
