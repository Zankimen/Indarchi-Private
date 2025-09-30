<?php

namespace Modules\Pekerja\Repositories\Eloquent;

use App\Models\User;

class PekerjaRepository
{
    public function all()
    {
        return User::all();
    }

    public function find($id)
    {
        return User::findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(User $user, array $data)
    {
        return $user->update($data);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $query = User::query();

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['name', 'email', 'created_at', 'role'];

        $sortBy = $request->get('sort_by');
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (! in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->leftJoin('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
            ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('users.*', 'roles.name as role');

        if ($sortBy === 'role') {
            $query->orderBy('roles.name', $sortDirection);
        } else {
            $query->orderBy("users.$sortBy", $sortDirection);
        }

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(users.name) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(users.email) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(roles.name) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function delete($id)
    {
        return User::destroy($id);
    }

    public function getAllPekerjaNoAll()
    {
        return User::select('name')
            ->distinct()
            ->whereNotNull('name')
            ->where('name', '!=', '')
            ->orderBy('name')
            ->get()
            ->pluck('name');
    }
}
