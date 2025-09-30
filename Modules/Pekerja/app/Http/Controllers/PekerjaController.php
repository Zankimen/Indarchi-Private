<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Modules\Pekerja\Services\PekerjaService;
use Modules\Pekerja\Http\Request\Pekerja\CreatePekerjaRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdatePekerjaRequest;

class PekerjaController extends Controller
{
    protected PekerjaService $pekerjaService;

    public function __construct(PekerjaService $pekerjaService)
    {
        $this->pekerjaService = $pekerjaService;
    }

    public function index(Request $request)
    {
        $pekerja = $this->pekerjaService->getPekerjaPaginated($request);

        return Inertia::render('Pekerja/PekerjaIndex', [
            'pekerja' => $pekerja,
            'filters' => $this->pekerjaService->getAllPekerjaFilter($request),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pekerja/PekerjaAdd');
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
        $user = $this->pekerjaService->findUserById((int) $id);

        return Inertia::render('Pekerja/PekerjaDetails', [
            'karyawan' => $this->pekerjaService->getKaryawanPayload($user),
        ]);
    }

    public function edit($user_id)
    {
        $user = $this->pekerjaService->findUserById((int) $user_id);

        return Inertia::render('Pekerja/PekerjaEdit', [
            'karyawan' => $this->pekerjaService->getKaryawanPayload($user),
        ]);
    }

    public function update(UpdatePekerjaRequest $request, $user_id)
    {
        try {
            $user = $this->pekerjaService->findUserById((int) $user_id);
            $this->pekerjaService->updatePekerja($user, $request->validated());

            return redirect()
                ->route('pekerja.index')
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
            $user = $this->pekerjaService->findUserById((int) $id);
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
}
