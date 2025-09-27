<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pekerja\Http\Request\Pekerja\CreateKaryawanRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdatePekerjaRequest;
use Modules\Pekerja\Services\PekerjaService;

class PekerjaController extends Controller
{
    protected $pekerjaService;

    public function __construct(PekerjaService $pekerjaService)
    {
        $this->pekerjaService = $pekerjaService;
    }

    public function index(Request $request)
    {
        return Inertia::render('Pekerja/PekerjaIndex', [
            'pekerja' => $this->pekerjaService->getPekerjaPaginated($request),
            'karyawan' => $this->pekerjaService->getKaryawanPaginated($request),
            'filters' => $this->pekerjaService->getAllPekerjaFilter($request),
        ]);
    }

    public function details(User $pekerja)
    {
        return Inertia::render('Pekerja/PekerjaDetails', [
            'pekerja' => $pekerja,
        ]);
    }

    public function addPage()
    {
        return Inertia::render('Pekerja/PekerjaAdd');
    }

    public function create(CreateKaryawanRequest $request)
    {
        $this->pekerjaService->createKaryawan($request->validated());

        return redirect()
            ->route('pekerja.index')
            ->with('success', 'Karyawan berhasil ditambahkan.');
    }

    public function editPage(User $pekerja)
    {
        return Inertia::render('Pekerja/PekerjaEdit', [
            'pekerja' => $pekerja,
        ]);
    }

    public function update(UpdatePekerjaRequest $request, User $pekerja)
    {
        $this->pekerjaService->updatePekerja($pekerja, $request->validated());

        return redirect()
            ->route('pekerja.index')
            ->with('success', 'Pekerja berhasil diperbarui.');
    }

    public function delete(User $pekerja)
    {
        $this->pekerjaService->deletePekerja($pekerja);

        return redirect()
            ->route('pekerja.index')
            ->with('success', 'Pekerja berhasil dihapus.');
    }
}