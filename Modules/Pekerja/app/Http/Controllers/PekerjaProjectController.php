<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\DB;
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
            $pekerja = $this->pekerjaProjectService->getPekerjaByProject($project_id);
            
            return Inertia::render('Pekerja/PekerjaProject', [
                'project' => $this->projectService->getProjectById($project_id),
                'pekerja' => $pekerja->values()->all(), // Convert collection to array
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
            
            // Query role directly from database for this project
            $posisi = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('model_has_roles.model_id', $pekerja_id)
                ->where('model_has_roles.model_type', 'App\\Models\\User')
                ->where(function ($q) use ($project_id) {
                    $q->where('model_has_roles.team_id', $project_id)
                        ->orWhereNull('model_has_roles.team_id');
                })
                ->value('roles.name');
            
            // If still empty, try getRoleNames() with team context
            if (empty($posisi)) {
                $roleNames = $pekerja->getRoleNames();
                if ($roleNames->isNotEmpty()) {
                    $posisi = $roleNames->first();
                } elseif ($pekerja->roles && $pekerja->roles->isNotEmpty()) {
                    $pekerja->load('roles');
                    $posisi = $pekerja->roles->first()->name ?? '';
                }
            }
            
            // Ensure roles are properly serialized as array
            $pekerjaData = $pekerja->toArray();
            if ($pekerja->roles && $pekerja->roles->isNotEmpty()) {
                $pekerjaData['roles'] = $pekerja->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                })->values()->toArray();
            } else {
                $pekerjaData['roles'] = [];
            }

            return Inertia::render('Pekerja/PekerjaProjectDetail', [
                'project' => $project,
                'pekerja' => $pekerjaData,
                'posisi' => $posisi,
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
            $this->pekerjaProjectService->updatePekerjaProjectPeran(
                [$request->validated()['posisi']], 
                $pekerja_id, 
                $project_id
            );

            // Redirect to list page to show updated data
            return redirect()->route('pekerja.projects.pekerja', $project_id, $this->SEE_OTHER)
                ->with('success', 'Posisi pekerja berhasil diperbarui.');
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()]);
        }

    }

    public function remove($project_id, $pekerja_id)
    {
        try {
            $this->pekerjaProjectService->removePekerjaFromProject($pekerja_id, $project_id);

            return redirect()->route('pekerja.projects.pekerja', $project_id, $this->SEE_OTHER)
                ->with('success', 'Pekerja berhasil dikeluarkan dari project.');
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()]);
        }
    }
}
