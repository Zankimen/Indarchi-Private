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
            return back()->with(['error' => $e->getMessage()]);
        }
    }

    public function create(CreatePekerjaRequest $request)
    {
        try {
            $this->pekerjaService->createPekerja($request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Pekerja berhasil ditambahkan.');
        } catch (Exception $e) {
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function details($id)
    {
        try {
            return Inertia::render('Pekerja/PekerjaDetails', [
                'pekerja' => $this->pekerjaService->findPekerjaById($id)->load(['roles']),
                'perans' => $this->peranService->getAllPerans(),
            ]);
        } catch (Exception $e) {
            return back()
                ->with(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function update(UpdatePekerjaRequest $request, $id)
    {
        try {
            $user = $this->pekerjaService->findPekerjaById($id);

            $this->pekerjaService->updatePekerja($user, $request->validated());

            return back($this->SEE_OTHER)
                ->with('success', 'Data pekerja berhasil diperbarui.');
        } catch (Exception $e) {
            return back()
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
            return back()
                ->with(['error' => $e->getMessage()]);
        }
    }
}
