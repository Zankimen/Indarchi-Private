<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pekerja\Http\Request\Pekerja\CreatePekerjaRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdatePekerjaRequest;
use Modules\Pekerja\Services\PekerjaService;
use Modules\Peran\Services\PeranService;
use Modules\Project\Services\ProjectService;

class PekerjaController extends Controller
{
    protected PekerjaService $pekerjaService;
    protected PeranService $peranService;

    protected ProjectService $projectService;

    protected $SEE_OTHER = 303;

    public function __construct(PekerjaService $pekerjaService, PeranService $peranService, ProjectService $projectService)
    {
        $this->pekerjaService = $pekerjaService;
        $this->peranService = $peranService;
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        try {
            return Inertia::render('Pekerja/PekerjaIndex', [
                'pekerjas' => $this->pekerjaService->getPekerjasPaginated($request),
                'perans' => $this->peranService->getAllPerans(),
                'filters' => $this->pekerjaService->getAllPekerjaFilter($request),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function create(CreatePekerjaRequest $request)
    {
        try {
            $this->pekerjaService->createPekerja($request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Pekerja berhasil ditambahkan.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function details($id)
    {
        $pekerja = $this->pekerjaService->findPekerjaById($id);
        $pekerja->load(['roles']);

        return Inertia::render('Pekerja/PekerjaDetails', [
            'pekerja' => $pekerja,
            'perans' => $this->peranService->getAllPerans(),
        ]);
    }

    public function update(UpdatePekerjaRequest $request, $id)
    {
        try {
            $user = $this->pekerjaService->findPekerjaById($id);
            $this->pekerjaService->updatePekerja($user, $request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Data pekerja berhasil diperbarui.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $user = $this->pekerjaService->findPekerjaById($id);
            $this->pekerjaService->deletePekerja($user);

            return back($this->SEE_OTHER)
                ->with('success', 'Karyawan berhasil dihapus.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function project($project_id)
    {
        try {
            return Inertia::render('Pekerja/PekerjaProject', [
                'project' => $this->projectService->getProjectById($project_id),
                'pekerja' => $this->pekerjaService->getPekerjaByProject($project_id),
                'availableWorkers' => $this->pekerjaService->getAvailablePekerjaForProject($project_id),
                'roles' => $this->peranService->getAllPerans(),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }

    }

    public function addToProject(Request $request, $project_id)
    {
        try {
            $validated = $request->validate([
                'pekerja_id' => 'required|exists:users,id',
            ]);

            $this->pekerjaService->assignPekerjaToProject($validated['pekerja_id'], $project_id);

            return back()
                ->with('success', 'Pekerja berhasil ditambahkan ke project.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function createAndAssign(Request $request, $project_id)
    {
        $validated = $request->validate([
            'nama_karyawan' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'posisi' => 'required|string',
        ]);

        $user = $this->pekerjaService->createPekerja($validated);

        $this->pekerjaService->assignPekerjaToProject($user->id, $project_id);

        return back()
            ->with('success', 'Pekerja baru berhasil dibuat dan ditambahkan ke project.');
    }

    public function showInProject($project_id, $pekerja_id)
    {
        $project = $this->projectService->getProjectById($project_id);
        $pekerja = $this->pekerjaService->findPekerjaByIdWithPeran($project_id);
        $roles = $this->peranService->getAllPerans();
        $posisi = $pekerja->roles->first()->name ?? '-';

        return inertia('Pekerja/PekerjaProjectDetail', [
            'project' => $project,
            'pekerja' => $pekerja,
            'posisi' => $posisi,
            'roles' => $roles,
        ]);
    }

    public function updateRoleInProject(Request $request, $project_id, $pekerja_id)
    {
        $validated = $request->validate([
            'posisi' => 'required|string|exists:roles,name',
        ]);

        $pekerja = $this->pekerjaService->findPekerjaById($pekerja_id);

        $pekerja->syncRoles([$validated['posisi']]);

        return redirect()
            ->route('pekerja.projects.showInProject', ['project_id' => $project_id, 'pekerja_id' => $pekerja_id])
            ->with('success', 'Posisi pekerja berhasil diperbarui.');
    }
}
