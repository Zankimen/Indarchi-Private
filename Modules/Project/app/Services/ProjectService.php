<?php

namespace Modules\Project\Services;

use Illuminate\Http\Request;
use Modules\Project\Models\Project;
use Modules\Project\Repositories\Eloquent\ProjectRepository;

class ProjectService
{
    protected ProjectRepository $projectRepository;

    public function __construct(ProjectRepository $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    public function getProjectsPaginated(Request $request)
    {
        return $this->projectRepository->getFilteredSortedAndSearched($request);
    }

    public function createProject(array $data): Project
    {
        return $this->projectRepository->create($data);
    }

    public function updateProject(Project $project, array $data): Project
    {
        return $this->projectRepository->update($project, $data);
    }

    public function deleteProject(Project $project): bool|int|null
    {
        return $this->projectRepository->delete($project->id);
    }

    public function getAllProjectFilter(Request $request): array
    {
        return [
            'search'          => $request->search,
            'sort_by'         => $request->sort_by,
            'sort_direction'  => $request->sort_direction,
            'nama'            => $request->nama,
            'deskripsi'       => $request->deskripsi,
            'tanggal_mulai'   => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi'          => $request->lokasi,
            'radius'          => $request->radius,
            'per_page'        => $request->per_page,
        ];
    }
}