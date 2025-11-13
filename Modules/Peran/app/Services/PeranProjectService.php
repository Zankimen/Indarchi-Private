<?php

namespace Modules\Peran\Services;

use Modules\Peran\Repositories\PeranRepository;

class PeranProjectService
{
    public function __construct(private PeranRepository $peranRepository) {}

    public function getPeranById($id)
    {
        $peran = $this->peranRepository->getPeranById($id);
        $currentTeamId = getTeamId();

        if ($peran->team_id !== $currentTeamId) {
            abort(403);
        }

        return $peran;
    }

    public function getProjectPeransPaginated($request, $projectId)
    {
        return $this->peranRepository->getProjectPeransPaginated($request, $projectId);
    }

    public function getAllProjectPerans($projectId)
    {
        return $this->peranRepository->getAllProjectPerans($projectId);
    }

    public function getPeranProjectPermissions()
    {
        return $this->peranRepository->getProjectPermissions();
    }

    public function getAllPeranProjectFilter($request)
    {
        return [
            'search' => $request->search ?? '',
            'sort_by' => $request->sort_by ?? 'created_at',
            'sort_direction' => $request->sort_direction ?? 'desc',
            'per_page' => $request->per_page ?? 10,
        ];
    }

    public function createProjectPeran(array $data)
    {
        return $this->peranRepository->create($data);
    }
}
