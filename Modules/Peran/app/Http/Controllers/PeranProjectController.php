<?php

namespace Modules\Peran\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Peran\Http\Requests\Peran\CreatePeranRequest;
use Modules\Peran\Http\Requests\Peran\UpdatePeranRequest;
use Modules\Peran\Models\Peran;
use Modules\Peran\Services\PeranProjectService;
use Modules\Peran\Services\PeranService;
use Modules\Project\Services\ProjectService;

class PeranProjectController extends Controller
{
    protected PeranService $peranService;

    protected ProjectService $projectService;

    protected PeranProjectService $peranProjectService;

    protected $SEE_OTHER = 303;

    public function __construct(PeranService $peranService, ProjectService $projectService, PeranProjectService $peranProjectService)
    {
        $this->peranService = $peranService;
        $this->projectService = $projectService;
        $this->peranProjectService = $peranProjectService;
    }

    public function index(Request $request, $project_id)
    {
        try {
            return Inertia::render('Peran/PeranProjectIndex', [
                'project' => $this->projectService->getProjectById($project_id),
                'perans' => $this->peranProjectService->getProjectPeransPaginated($request, $project_id),
                'filters' => $this->peranProjectService->getAllPeranProjectFilter($request),
                'permissions' => $this->peranProjectService->getPeranProjectPermissions(),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function details($project_id, $peran_id)
    {
        try {
            $peran = $this->peranProjectService->getPeranById($peran_id);

            return Inertia::render('Peran/PeranProjectDetails', [
                'project' => $this->projectService->getProjectById($project_id),
                'peran' => $peran->load('permissions'),
                'permissions' => $this->peranProjectService->getPeranProjectPermissions(),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function create(CreatePeranRequest $request, $project_id)
    {
        try {
            $this->peranProjectService->createProjectPeran($request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Peran berhasil ditambahkan.');
        } catch (Exception $e) {
            return
                back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function update(UpdatePeranRequest $request, $project_id, $peran_id)
    {
        try {
            $peran = $this->peranProjectService->getPeranById($peran_id);
            $this->peranService->updatePeran($peran, $request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Peran berhasil diperbarui.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function delete($project_id, $peran_id)
    {
        try {
            $peran = $this->peranProjectService->getPeranById($peran_id);
            $peranName = $peran->name;
            $this->peranService->deletePeran($peran);

            return redirect("/projects/{$project_id}/peran", $this->SEE_OTHER)
                ->with('success', "Peran \"{$peranName}\" berhasil dihapus");
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
