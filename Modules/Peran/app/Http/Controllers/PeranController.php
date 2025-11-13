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
use Modules\Project\Services\ProjectService;

class PeranController extends Controller
{
    protected PeranService $peranService;

    protected ProjectService $projectService;

    protected $SEE_OTHER = 303;

    public function __construct(PeranService $peranService, ProjectService $projectService)
    {
        $this->peranService = $peranService;
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        try {
            return Inertia::render('Peran/PeranIndex', [
                'perans' => $this->peranService->getPeransPaginated($request),
                'filters' => $this->peranService->getAllPeranFilter($request),
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
            $this->peranService->createPeran($request->validated());

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
            $this->peranService->updatePeran($peran, $request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Peran berhasil diperbarui.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function delete(Peran $peran)
    {
        try {
            $peranName = $peran->name;
            $this->peranService->deletePeran($peran);

            return redirect('/dashboard/peran', $this->SEE_OTHER)
                ->with('success', "Peran \"{$peranName}\" berhasil dihapus");
        } catch (Exception $e) {
            return back($this->SEE_OTHER)->withErrors(['error' => $e->getMessage()]);
        }
    }
}
