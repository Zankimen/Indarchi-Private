<?php

namespace Modules\Peran\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Modules\Peran\Models\Peran;
use Modules\Peran\Repositories\PeranRepository;

class PeranService
{
    public function __construct(private PeranRepository $peranRepository) {}

    public function getPeransPaginated($request)
    {
        return $this->peranRepository->getPeransPaginated($request);
    }

    public function getAllPerans()
    {
        return $this->peranRepository->getAllPerans();
    }

    public function getAllPermissions()
    {
        return $this->peranRepository->getAllPermissions();
    }

    public function createPeran(array $data): Peran
    {
        return $this->peranRepository->create($data);
    }

    public function updatePeran(Peran $peran, array $data): Peran
    {
        return $this->peranRepository->update($peran, $data);
    }

    public function deletePeran(Peran $role): bool
    {
        if (method_exists($role, 'users') && $role->users()->count() > 0) {
            throw new Exception('Tidak dapat menghapus peran yang sedang digunakan oleh pengguna.');
        }

        if (Schema::hasTable('workers')) {
            $workersCount = DB::table('workers')
                ->where('role_id', $role->id)
                ->count();

            if ($workersCount > 0) {
                throw new Exception('Tidak dapat menghapus peran yang sedang digunakan oleh pekerja.');
            }
        }

        return $this->peranRepository->delete($role);
    }

    public function getAllPeranFilter($request)
    {
        return [
            'search' => $request->search ?? '',
            'sort_by' => $request->sort_by ?? 'created_at',
            'sort_direction' => $request->sort_direction ?? 'desc',
            'per_page' => $request->per_page ?? 10,
        ];
    }
}
