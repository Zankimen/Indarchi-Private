<?php

namespace Modules\Pekerja\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Pekerja\Models\Karyawan;
use Modules\Pekerja\Services\PekerjaService;
use Modules\Pekerja\Http\Request\Pekerja\CreateKaryawanRequest;
use Modules\Pekerja\Http\Request\Pekerja\UpdateKaryawanRequest;

class PekerjaController extends Controller
{
    protected PekerjaService $pekerjaService;

    public function __construct(PekerjaService $pekerjaService)
    {
        $this->pekerjaService = $pekerjaService;
    }

    /**
     * List semua karyawan (gabungan users + karyawan).
     */
    public function index(Request $request)
    {
        $pekerja = $this->pekerjaService->getUnifiedPekerjaPaginated($request);

        return Inertia::render('Pekerja/PekerjaIndex', [
            'pekerja' => $pekerja,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Form tambah karyawan baru.
     */
    public function create()
    {
        return Inertia::render('Pekerja/PekerjaAdd');
    }

    /**
     * Simpan karyawan baru (user + karyawan).
     */
    public function store(CreateKaryawanRequest $request)
    {
        $this->pekerjaService->createUnifiedKaryawan($request->validated());

        return redirect()->route('pekerja.index')
            ->with('success', 'Karyawan berhasil ditambahkan.');
    }

    /**
     * Detail karyawan berdasarkan user_id.
     */
    public function details($user_id)
    {
        $karyawan = Karyawan::with('user')
            ->where('user_id', $user_id)
            ->firstOrFail();

        return Inertia::render('Pekerja/PekerjaDetails', [
            'karyawan' => $karyawan,
        ]);
    }

    /**
     * Form edit karyawan berdasarkan user_id.
     */
    public function edit($user_id)
    {
        $karyawan = Karyawan::with('user')
            ->where('user_id', $user_id)
            ->firstOrFail();

        return Inertia::render('Pekerja/PekerjaEdit', [
            'karyawan' => $karyawan,
        ]);
    }

    /**
     * Update data karyawan (user + karyawan).
     */
    public function update(UpdateKaryawanRequest $request, $userId)
    {
        $karyawan = Karyawan::with('user')
            ->where('user_id', $userId)
            ->firstOrFail();

        $this->pekerjaService->updateUnifiedKaryawan($karyawan, $request->validated());

        return redirect()->route('pekerja.index')
            ->with('success', 'Data karyawan berhasil diperbarui.');
    }

    /**
     * Hapus karyawan (hapus user akan cascade ke karyawan karena relasi).
     */
    public function destroy($user_id)
    {
        $karyawan = Karyawan::with('user')
            ->where('user_id', $user_id)
            ->firstOrFail();

        if ($karyawan->user) {
            $this->pekerjaService->deletePekerja($karyawan->user);
        }

        return redirect()->route('pekerja.index')
            ->with('success', 'Karyawan berhasil dihapus.');
    }
}
