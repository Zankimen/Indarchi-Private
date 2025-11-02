<?php

namespace Modules\Peran\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Peran\Http\Requests\Peran\CreatePeranRequest;
use Modules\Peran\Http\Requests\Peran\UpdatePeranRequest;
use Modules\Peran\Models\Peran;
use Modules\Peran\Services\PeranService;

class PeranController extends Controller
{
    protected PeranService $peranService;

    protected $SEE_OTHER = 303;

    public function __construct(PeranService $peranService)
    {
        $this->peranService = $peranService;
    }

    public function index(Request $request)
    {
        try {
            return Inertia::render('Peran/PeranIndex', [
                'perans' => $this->peranService->getPeransPaginated($request),
                'filters' => $this->peranService->getAllPeranFilter($request),
                'permissions' => $this->peranService->getAllPermissions(),
                'permissions' => $this->peranService->getAllPermissions(),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function details(Peran $peran)
    {
        try {
            return Inertia::render('Peran/PeranDetails', [
                'peran' => $peran->load('permissions'),
                'permissions' => $this->peranService->getAllPermissions(),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function create(CreatePeranRequest $request)
    {
        try {
            $this->peranService->createRole($request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Peran berhasil ditambahkan.');
        } catch (Exception $e) {
            return
                back($this->SEE_OTHER)
                    ->withErrors(['error' => $e->getMessage()])
                    ->withInput();
        }
    }

    public function update(UpdatePeranRequest $request, Peran $peran)
    {
        try {
            $this->peranService->updateRole($peran, $request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Peran berhasil diperbarui.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function delete(Peran $role)
    {
        try {
            $this->peranService->deleteRole($role);

            return back($this->SEE_OTHER)
                ->with('success', 'Peran berhasil dihapus.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}