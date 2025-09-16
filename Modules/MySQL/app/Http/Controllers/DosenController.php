<?php

namespace Modules\MySQL\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\MySQL\Http\Request\Dosen\CreateDosenRequest;
use Modules\MySQL\Http\Request\Dosen\UpdateDosenRequest;
use Modules\MySQL\Models\Dosen;
use Modules\MySQL\Services\DosenService;

class DosenController extends Controller
{
    protected $dosenService;

    public function __construct(DosenService $dosenService)
    {
        $this->dosenService = $dosenService;
    }

    public function index(Request $request)
    {
        return Inertia::render('MySQL/DosenIndex', [
            'dosen' => $this->dosenService->getDosenPaginated($request),
            'filters' => $this->dosenService->getAllDosenFilter($request),
        ]);
    }

    public function details(Dosen $dosen)
    {
        return Inertia::render('MySQL/DosenDetails', [
            'dosen' => $dosen,
        ]);
    }

    public function addPage()
    {
        return Inertia::render('MySQL/DosenAdd');
    }

    public function create(CreateDosenRequest $request)
    {
        $this->dosenService->createDosen($request->validated());

        return redirect()
            ->route('mysql.dosen.index')
            ->with('success', 'Dosen Added Successfully.');
    }

    public function editPage(Dosen $dosen)
    {
        return Inertia::render('MySQL/DosenEdit', [
            'dosen' => $dosen,
        ]);
    }

    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        $this->dosenService->updateDosen($dosen, $request->validated());

        return redirect()
            ->route('mysql.dosen.index')
            ->with('success', 'Dosen updated successfully!');
    }

    public function delete(Dosen $dosen)
    {
        $this->dosenService->deleteDosen($dosen);

        return redirect()
            ->route('mysql.dosen.index')
            ->with('success', 'Dosen Deleted Successfully.');
    }
}
