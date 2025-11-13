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
        $users = User::whereHas('projects', function ($q) use ($projectId) {
            $q->where('project_id', $projectId);
        })->with('roles')->get();

        return $users;
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
