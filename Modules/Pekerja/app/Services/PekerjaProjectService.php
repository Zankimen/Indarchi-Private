<?php

namespace Modules\Pekerja\Services;

use App\Models\User;
use DB;
use Modules\Pekerja\Repositories\PekerjaRepository;

class PekerjaProjectService
{
    protected PekerjaRepository $pekerjaRepository;

    public function __construct(PekerjaRepository $pekerjaRepository)
    {
        $this->pekerjaRepository = $pekerjaRepository;
    }

    public function getPekerjaByProject($projectId)
    {
        // Query users with their roles for this specific project (team_id)
        $users = User::whereHas('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })
        ->leftJoin('model_has_roles', function ($join) use ($projectId) {
            $join->on('users.id', '=', 'model_has_roles.model_id')
                ->where('model_has_roles.model_type', '=', 'App\\Models\\User')
                ->where(function ($q) use ($projectId) {
                    $q->where('model_has_roles.team_id', $projectId)
                        ->orWhereNull('model_has_roles.team_id');
                });
        })
        ->leftJoin('roles', 'model_has_roles.role_id', '=', 'roles.id')
        ->select('users.*', 'roles.name as posisi')
        ->get()
        ->unique('id'); // Remove duplicates if user has multiple roles

        // Add posisi attribute to each user
        return $users->map(function ($user) use ($projectId) {
            $userData = $user->toArray();
            
            // Get posisi from the query result
            $posisi = $user->posisi ?? '';
            
            // If posisi is still empty, try to get from roles relationship
            if (empty($posisi)) {
                // Set team context temporarily
                $originalTeamId = getTeamId();
                setTeamId($projectId);
                
                $user->load('roles');
                if ($user->roles && $user->roles->isNotEmpty()) {
                    $posisi = $user->roles->first()->name ?? '';
                }
                
                // Restore original team context
                setTeamId($originalTeamId);
            }
            
            // Ensure roles are properly serialized
            if ($user->roles && $user->roles->isNotEmpty()) {
                $userData['roles'] = $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                })->values()->toArray();
            } else {
                $userData['roles'] = [];
            }
            
            // Add posisi to userData (use the one from query or fallback)
            $userData['posisi'] = $posisi;
            
            return $userData;
        });
    }

    public function getAvailablePekerjaForProject($projectId)
    {
        return $this->pekerjaRepository->getUnassignedPekerjaAtProject($projectId);
    }

    public function assignPekerjaToProject($pekerjaId, $projectId)
    {
        return DB::transaction(function () use ($pekerjaId, $projectId) {
            $user = $this->pekerjaRepository->find($pekerjaId);

            $user->projects()->attach($projectId);
        });
    }

    public function findPekerjaByIdWithPeran(int $id)
    {
        return $this->pekerjaRepository->findWithPeran($id);
    }

    public function findPekerjaById(int $id)
    {
        return $this->pekerjaRepository->find($id);
    }

    public function updatePekerjaProjectPeran($request, $pekerja_id)
    {
        return DB::transaction(function () use ($request, $pekerja_id) {
            $pekerja = $this->findPekerjaById($pekerja_id);

            $pekerja->syncRoles($request);
        });
    }
}
