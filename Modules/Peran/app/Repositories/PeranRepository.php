<?php

namespace Modules\Peran\Repositories;

use Modules\Peran\Models\Peran;
use Modules\Peran\Models\Permission;

class PeranRepository
{
    public function getPeransPaginated($request)
    {
        $query = Peran::with('permissions')
            ->withCount('permissions')
            ->whereNull('team_id')
            ->when($request->search, function ($q, $search) {
                $q->search($search);
            })
            ->when($request->sort_by, function ($q, $sortBy) use ($request) {
                $q->orderBy($sortBy, $request->sort_direction ?? 'asc');
            });

        return $query->paginate($request->per_page ?? 10);
    }

    public function getProjectPeransPaginated($request, $projectId)
    {
        $query = Peran::with('permissions')
            ->withCount('permissions')
            ->where('team_id', $projectId)
            ->when($request->search, function ($q, $search) {
                $q->search($search);
            })
            ->when($request->sort_by, function ($q, $sortBy) use ($request) {
                $q->orderBy($sortBy, $request->sort_direction ?? 'asc');
            });

        return $query->paginate($request->per_page ?? 10);
    }

    public function getPeranById($id)
    {
        return Peran::findById($id);
    }

    public function getAllPermissions()
    {
        return Permission::orderBy('name', 'asc')->get();
    }

    public function getProjectPermissions()
    {
        return Permission::where('name', 'like', 'project.%')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getAllPerans()
    {
        return Peran::orderBy('name', 'asc')->where('team_id', null)->get();
    }

    public function getAllProjectPerans($projectId)
    {
        return Peran::orderBy('name', 'asc')->where('team_id', $projectId)->get();
    }

    public function create(array $data): Peran
    {
        $role = Peran::create([
            'name' => $data['name'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'guard_name' => 'web',
        ]);

        if (isset($data['permissions']) && ! empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function update(Peran $role, array $data): Peran
    {
        $role->update([
            'name' => $data['name'],
            'deskripsi' => $data['deskripsi'] ?? null,
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        } else {
            $role->syncPermissions([]);
        }

        $this->clearMenuCacheForRole($role);

        return $role;
    }

    protected function clearMenuCacheForRole(Peran $role): void
    {
        $users = $role->users;

        foreach ($users as $user) {
            cache()->forget('menus_for_user_'.$user->id);
        }
    }

    public function delete(Peran $role): bool
    {
        return (bool) $role->delete();
    }
}
