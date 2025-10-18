<?php

namespace Modules\Pekerja\Services;

use App\Models\User;
use Modules\Pekerja\Repositories\Eloquent\PekerjaRepository;
use Illuminate\Support\Facades\Hash;


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
        ];

        // Only update password if provided
        if (!empty($data['password'])) {
            $updateData['password'] = bcrypt($data['password']);
        }

        // Update user data
        $this->pekerjaRepository->update($user, $updateData);

        // Update role if provided
        if (isset($data['posisi'])) {
            // Sync roles (remove old roles and assign new one)
            $user->syncRoles([$data['posisi']]);
        }

        return $user;
    }

    public function getKaryawanPayload(User $user): array
    {
        return [
            'user_id' => $user->id,
            'nama_karyawan' => $user->name,
            'alamat' => $user->alamat,
            'posisi' => $user->roles->first()?->name,
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

    public function getPekerjaByProject($projectId)
    {
        $users = User::whereHas('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })->with('roles')->get();

        // Tambahkan atribut posisi secara langsung
        $users->transform(function ($user) {
            $user->posisi = $user->roles->first()->name ?? '-';
            return $user;
        });

        return $users;
    }

    public function getAvailablePekerjaForProject($projectId)
    {
        return User::whereDoesntHave('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })->orderBy('name')->get(['id', 'name']);
    }

    public function assignPekerjaToProject($pekerjaId, $projectId)
    {
        $user = User::findOrFail($pekerjaId);
        $user->projects()->attach($projectId);
    }

    public function createNewPekerja(array $data)
{
    $userData = [
        'name' => $data['nama_karyawan'] ?? $data['name'] ?? '',
        'email' => $data['email'],
        'alamat' => $data['alamat'] ?? null,
    ];

    if (!empty($data['password'])) {
        $userData['password'] = bcrypt($data['password']);
    }

    $user = User::create($userData);

    // assign role (cek key 'posisi' atau 'role')
    $roleName = $data['posisi'] ?? $data['role'] ?? null;
    if ($roleName) {
        $user->assignRole($roleName);
    }

    return $user;
}

}