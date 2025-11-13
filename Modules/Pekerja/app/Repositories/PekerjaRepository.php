<?php

namespace Modules\Pekerja\Repositories;

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

    public function findWithPeran($id)
    {
        return User::with('roles')->findOrFail($id);
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
        $sortBy = in_array($request->get('sort_by'), $allowedSorts)
            ? $request->get('sort_by')
            : 'name';

        $sortDirection = in_array(strtolower($request->get('sort_direction', 'asc')), ['asc', 'desc'])
            ? strtolower($request->get('sort_direction', 'asc'))
            : 'asc';

        $teamId = getTeamId();

        $query->leftJoin('model_has_roles', function ($join) use ($teamId) {
            $join->on('users.id', '=', 'model_has_roles.model_id')
                ->where(function ($q) use ($teamId) {
                    $q->where('model_has_roles.team_id', $teamId)
                        ->orWhereNull('model_has_roles.team_id');
                });
        })
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

    public function getUnassignedPekerjaAtProject($projectId)
    {
        $tempTeamId = getTeamId();

        setTeamId(null);

        $pekerjas = User::whereDoesntHave('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })
            ->permission('dashboard.project.can.be.added')
            ->orderBy('name')
            ->get(['id', 'name']);

        setTeamId($tempTeamId);

        return $pekerjas;
    }
}
