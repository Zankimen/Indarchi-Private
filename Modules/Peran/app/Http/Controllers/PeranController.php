<?php

namespace Modules\Peran\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Peran\Http\Requests\Peran\CreatePeranRequest;
use Modules\Peran\Http\Requests\Peran\UpdatePeranRequest;
use Modules\Peran\Services\PeranService;
use Modules\Peran\Models\Peran;

class PeranController extends Controller
{
    protected $peranService;

    public function __construct(PeranService $peranService)
    {
        $this->peranService = $peranService;
    }

    public function index(Request $request)
    {
        try {
            return Inertia::render('Peran/PeranIndex', [
                'roles' => $this->peranService->getPeransPaginated($request),
                'filters' => $this->peranService->getAllPeranFilter($request),
                'permissions' => $this->peranService->getAllPermissions(), // Tambahkan ini
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function details(Peran $role)
    {
        return Inertia::render('Peran/PeranDetails', [
            'role' => $role->load('permissions'),
        ]);
    }

    public function create(CreatePeranRequest $request)
    {
        try {
            $this->peranService->createRole($request->validated());

            return redirect()
                ->route('role.index')
                ->with('success', 'Peran berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function editPage(Peran $role)
    {
        return Inertia::render('Peran/PeranEdit', [
            'role' => $role->load('permissions'),
            'permissions' => $this->peranService->getAllPermissions(),
        ]);
    }

    public function update(UpdatePeranRequest $request, Peran $role)
    {
        try {
            $this->peranService->updateRole($role, $request->validated());

            return redirect()
                ->route('role.index')
                ->with('success', 'Peran berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function delete(Peran $role)
    {
        try {
            $this->peranService->deleteRole($role);

            return redirect()
                ->route('role.index')
                ->with('success', 'Peran berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
