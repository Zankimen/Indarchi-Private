<?php

namespace Modules\Peran\Services;

use Spatie\Permission\Models\Permission;
use Modules\Peran\Models\Peran;

class PeranService
{
    public function getPeransPaginated($request)
    {
        $query = Peran::with('permissions')
            ->when($request->search, function ($q, $search) {
                $q->search($search);
            })
            ->when($request->sort_by, function ($q, $sortBy) use ($request) {
                $q->orderBy($sortBy, $request->sort_direction ?? 'asc');
            }, function ($q) {
                $q->orderBy('created_at', 'desc');
            });

        return $query->paginate($request->per_page ?? 10);
    }

    public function getAllPermissions()
    {
        return Permission::orderBy('name', 'asc')->get();
    }

    public function createRole(array $data)
    {
        $role = Peran::create([
            'name' => $data['nama'],
            'nama' => $data['nama'],
            'guard_name' => 'web'
        ]);

        if (isset($data['permissions']) && !empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function updateRole($role, array $data)
    {
        $role->update([
            'name' => $data['nama'],
            'nama' => $data['nama'],
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        } else {
            $role->syncPermissions([]);
        }

        return $role;
    }

    public function deleteRole($role)
    {
        // Check if role is being used by users
        if (method_exists($role, 'users') && $role->users()->count() > 0) {
            throw new \Exception('Tidak dapat menghapus peran yang sedang digunakan oleh pengguna.');
        }

        // Check if role is being used in workers table
        $workersCount = \Illuminate\Support\Facades\DB::table('workers')
            ->where('role_id', $role->id)
            ->count();

        if ($workersCount > 0) {
            throw new \Exception('Tidak dapat menghapus peran yang sedang digunakan oleh pekerja.');
        }

        return $role->delete();
    }

    public function getAllPeranFilter($request)
    {
        return [
            'search' => $request->search ?? '',
            'sort_by' => $request->sort_by ?? 'created_at',
            'sort_direction' => $request->sort_direction ?? 'desc',
            'per_page' => $request->per_page ?? 10
        ];
    }
}
