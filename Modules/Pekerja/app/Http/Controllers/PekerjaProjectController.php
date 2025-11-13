<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Inertia\Inertia;
use Modules\Pekerja\Http\Request\Pekerja\AddToProjectRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdateProjectPekerjaPeranRequest;
use Modules\Pekerja\Services\PekerjaProjectService;
use Modules\Peran\Services\PeranProjectService;
use Modules\Project\Services\ProjectService;

class PekerjaProjectController extends Controller
{
    protected PekerjaProjectService $pekerjaProjectService;

    protected PeranProjectService $peranProjectService;

    protected ProjectService $projectService;

    protected $SEE_OTHER = 303;

    public function __construct(PekerjaProjectService $pekerjaProjectService, PeranProjectService $peranProjectService, ProjectService $projectService)
    {
        $this->pekerjaProjectService = $pekerjaProjectService;
        $this->peranProjectService = $peranProjectService;
        $this->projectService = $projectService;
    }

    public function index($project_id)
    {
        try {
            return Inertia::render('Pekerja/PekerjaProject', [
                'project' => $this->projectService->getProjectById($project_id),
                'pekerja' => $this->pekerjaProjectService->getPekerjaByProject($project_id),
                'availableWorkers' => $this->pekerjaProjectService->getAvailablePekerjaForProject($project_id),
                'roles' => $this->peranProjectService->getAllProjectPerans($project_id),
            ]);
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()]);
        }
    }

    public function addToProject(AddToProjectRequest $request, $project_id)
    {
        try {
            $this->pekerjaProjectService->assignPekerjaToProject($request->validated()['pekerja_id'], $project_id);

            return back($this->SEE_OTHER)
                ->with('success', 'Pekerja berhasil ditambahkan ke project.');
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()]);
        }
    }

    // public function createAndAssign(Request $request, $project_id)
    // {
    //     $validated = $request->validate([
    //         'nama_karyawan' => 'required|string|max:255',
    //         'email' => 'required|email|unique:users,email',
    //         'password' => 'required|min:6',
    //         'posisi' => 'required|string',
    //     ]);

    //     $user = $this->pekerjaService->createPekerja($validated);

    //     $this->pekerjaService->assignPekerjaToProject($user->id, $project_id);

    //     return back()
    //         ->with('success', 'Pekerja baru berhasil dibuat dan ditambahkan ke project.');
    // }

    public function details($project_id, $pekerja_id)
    {
        try {
            $project = $this->projectService->getProjectById($project_id);
            $pekerja = $this->pekerjaProjectService->findPekerjaByIdWithPeran($pekerja_id);
            $roles = $this->peranProjectService->getAllProjectPerans($project_id);

            return inertia('Pekerja/PekerjaProjectDetail', [
                'project' => $project,
                'pekerja' => $pekerja,
                'roles' => $roles,
            ]);
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()]);
        }
    }

    public function updateProjectPeran(UpdateProjectPekerjaPeranRequest $request, $project_id, $pekerja_id)
    {
        try {
            $this->pekerjaProjectService->updatePekerjaProjectPeran([$request->validated()['posisi']], $pekerja_id);

            return back($this->SEE_OTHER)
                ->with('success', 'Posisi pekerja berhasil diperbarui.');
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()]);
        }

    }
}
