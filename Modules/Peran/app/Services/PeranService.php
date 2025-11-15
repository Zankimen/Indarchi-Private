<?php

namespace Modules\Peran\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Modules\Peran\Models\Peran;
use Modules\Peran\Repositories\PeranRepository;

class PeranService
{
    // Protected roles that cannot be deleted or modified
    protected array $protectedRoles = ['admin'];

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
        // Protect admin role from being modified
        if ($this->isProtectedRole($peran)) {
            throw new Exception('Peran "'.$peran->name.'" dilindungi dan tidak dapat diubah.');
        }

        return $this->peranRepository->update($peran, $data);
    }

    public function deletePeran(Peran $role): bool
    {
        // Protect admin role from being deleted
        if ($this->isProtectedRole($role)) {
            throw new Exception('Peran "'.$role->name.'" dilindungi dan tidak dapat dihapus.');
        }

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

    /**
     * Check if the role is protected
     */
    protected function isProtectedRole(Peran $role): bool
    {
        return in_array(strtolower($role->name), array_map('strtolower', $this->protectedRoles));
    }

    /**
     * Check if role name is protected (for validation)
     */
    public function isProtectedRoleName(string $roleName): bool
    {
        return in_array(strtolower($roleName), array_map('strtolower', $this->protectedRoles));
    }
}
