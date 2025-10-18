<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pekerja\Http\Request\Pekerja\CreatePekerjaRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdatePekerjaRequest;
use Modules\Pekerja\Services\PekerjaService;
use Modules\Peran\Services\PeranService;

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

    public function project(Request $request)
    {
        return Inertia::render('Pekerja/PekerjaProject', [
            'pekerja' => $this->pekerjaService->getPekerjaPaginated($request),
        ]);
    }
}