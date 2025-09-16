<?php

namespace Modules\MySQL\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\MySQL\Http\Request\Mahasiswa\CreateMahasiswaRequest;
use Modules\MySQL\Http\Request\Mahasiswa\UpdateMahasiswaRequest;
use Modules\MySQL\Models\Mahasiswa;
use Modules\MySQL\Services\MahasiswaService;

class MahasiswaController extends Controller
{
    protected $mahasiswaService;

    public function __construct(MahasiswaService $mahasiswaService)
    {
        $this->mahasiswaService = $mahasiswaService;
    }

    public function index(Request $request)
    {
        return Inertia::render('MySQL/MahasiswaIndex', [
            'mahasiswa' => $this->mahasiswaService->getMahasiswaPaginated($request),
            'filters' => $this->mahasiswaService->getAllMahasiswaFilter($request),
        ]);
    }

    public function details(Mahasiswa $mahasiswa)
    {
        return Inertia::render('MySQL/MahasiswaDetails', [
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function addPage()
    {
        return Inertia::render('MySQL/MahasiswaAdd');
    }

    public function create(CreateMahasiswaRequest $request)
    {
        $this->mahasiswaService->createMahasiswa($request->validated());

        return redirect()
            ->route('mysql.mahasiswa.index')
            ->with('success', 'Mahasiswa Added Successfully.');
    }

    public function editPage(Mahasiswa $mahasiswa)
    {
        return Inertia::render('MySQL/MahasiswaEdit', [
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa)
    {
        $this->mahasiswaService->updateMahasiswa($mahasiswa, $request->validated());

        return redirect()
            ->route('mysql.mahasiswa.index')
            ->with('success', 'Mahasiswa updated successfully!');
    }

    public function delete(Mahasiswa $mahasiswa)
    {
        $this->mahasiswaService->deleteMahasiswa($mahasiswa);

        return redirect()
            ->route('mysql.mahasiswa.index')
            ->with('success', 'Mahasiswa Deleted Successfully.');
    }
}
