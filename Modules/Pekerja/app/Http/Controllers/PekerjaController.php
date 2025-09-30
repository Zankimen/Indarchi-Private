<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pekerja\Services\PekerjaService;

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
            'filters' => $request->all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Pekerja/PekerjaAdd');
    }

    // public function store(CreatePekerjaRequest $request)
    // {
        

    //     return redirect()->route('pekerja.index')
    //         ->with('success', 'Karyawan berhasil ditambahkan.');
    // }

    // public function details($user_id)
    // {
    //     $karyawan = Karyawan::with('user')
    //         ->where('user_id', $user_id)
    //         ->firstOrFail();

    //     return Inertia::render('Pekerja/PekerjaDetails', [
    //         'karyawan' => $karyawan,
    //     ]);
    // }

    // public function edit($user_id)
    // {
    //     $karyawan = Karyawan::with('user')
    //         ->where('user_id', $user_id)
    //         ->firstOrFail();

    //     return Inertia::render('Pekerja/PekerjaEdit', [
    //         'karyawan' => $karyawan,
    //     ]);
    // }

    // public function update(UpdatePekerjaRequest $request, $userId)
    // {
    //     $karyawan = Karyawan::with('user')
    //         ->where('user_id', $userId)
    //         ->firstOrFail();

    //     return redirect()->route('pekerja.index')
    //         ->with('success', 'Data karyawan berhasil diperbarui.');
    // }

    // public function destroy($user_id)
    // {
    //     $karyawan = Karyawan::with('user')
    //         ->where('user_id', $user_id)
    //         ->firstOrFail();

    //     if ($karyawan->user) {
    //         $this->pekerjaService->deletePekerja($karyawan->user);
    //     }

    //     return redirect()->route('pekerja.index')
    //         ->with('success', 'Karyawan berhasil dihapus.');
    // }
}
