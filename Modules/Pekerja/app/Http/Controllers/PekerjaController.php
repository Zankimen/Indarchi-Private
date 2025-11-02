<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pekerja\Http\Request\Pekerja\CreatePekerjaRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdatePekerjaRequest;
use Modules\Pekerja\Services\PekerjaService;
use Modules\Project\Models\Project;
use Modules\Peran\Services\PeranService;
use Spatie\Permission\Models\Role;


class PekerjaController extends Controller
{
    protected PekerjaService $pekerjaService;
    protected PeranService $peranService;

    public function __construct(PekerjaService $pekerjaService, PeranService $peranService)
    {
        $this->pekerjaService = $pekerjaService;
        $this->peranService = $peranService;
    }

    public function index(Request $request)
    {
        return Inertia::render('Pekerja/PekerjaIndex', [
            'pekerja' => $this->pekerjaService->getPekerjaPaginated($request),
            'peran' => $this->peranService->getAllPeran(),
            'filters' => $this->pekerjaService->getAllPekerjaFilter($request),
        ]);
    }

    public function store(CreatePekerjaRequest $request)
    {
        try {
            $this->pekerjaService->createPekerja($request->validated());

            return redirect()
                ->route('pekerja.index')
                ->with('success', 'Karyawan berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function details($id)
    {
        $pekerja = $this->pekerjaService->findPekerjaById($id);
        
        // Load relationships
        $pekerja->load(['roles', 'permissions']);

        return Inertia::render('Pekerja/PekerjaDetails', [
            'pekerja' => $pekerja,
            'peran' => $this->peranService->getAllPeran(),
        ]);
    }

    public function update(UpdatePekerjaRequest $request, $id)
    {
        try {
            $user = $this->pekerjaService->findPekerjaById($id);
            $this->pekerjaService->updatePekerja($user, $request->validated());

            return redirect()
                ->route('pekerja.details', $id)
                ->with('success', 'Data karyawan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $user = $this->pekerjaService->findPekerjaById($id);
            $this->pekerjaService->deletePekerja($user);

            return redirect()
                ->route('pekerja.index')
                ->with('success', 'Karyawan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function project($project_id)
    {
        $project = Project::findOrFail($project_id);

        $pekerja = $this->pekerjaService->getPekerjaByProject($project_id);
        $availableWorkers = $this->pekerjaService->getAvailablePekerjaForProject($project_id);
        $roles = Role::all();

        return Inertia::render('Pekerja/PekerjaProject', [ 
            'project' => $project,
            'pekerja' => $pekerja,
            'availableWorkers' => $availableWorkers,
            'roles' => $roles,
        ]);
    }

    public function addToProject(Request $request, $project_id)
    {
        $validated = $request->validate([
            'pekerja_id' => 'required|exists:users,id',
        ]);

        $this->pekerjaService->assignPekerjaToProject($validated['pekerja_id'], $project_id);

        return redirect()
            ->back()
            ->with('success', 'Pekerja berhasil ditambahkan ke project.');
    }

    public function createAndAssign(Request $request, $project_id)
    {
        $validated = $request->validate([
            'nama_karyawan' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'posisi' => 'required|string',
        ]);

        // Buat pekerja baru
        $user = $this->pekerjaService->createNewPekerja($validated);

        // Assign pekerja ke project
        $this->pekerjaService->assignPekerjaToProject($user->id, $project_id);

        return redirect()
            ->back()
            ->with('success', 'Pekerja baru berhasil dibuat dan ditambahkan ke project.');
    }

    public function showInProject($project_id, $pekerja_id)
    {
        $project = \Modules\Project\Models\Project::findOrFail($project_id);
        $pekerja = \App\Models\User::with('roles')->findOrFail($pekerja_id);
        $roles = \Spatie\Permission\Models\Role::orderBy('name')->get(['id', 'name']);
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

        $pekerja = \App\Models\User::findOrFail($pekerja_id);

        // Hapus role lama dan tambahkan role baru
        $pekerja->syncRoles([$validated['posisi']]);

        return redirect()
            ->route('pekerja.projects.showInProject', ['project_id' => $project_id, 'pekerja_id' => $pekerja_id])
            ->with('success', 'Posisi pekerja berhasil diperbarui.');
    }



}

