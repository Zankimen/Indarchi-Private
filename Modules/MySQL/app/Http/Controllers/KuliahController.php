<?php

namespace Modules\MySQL\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\MySQL\Http\Request\Kuliah\CreateKuliahRequest;
use Modules\MySQL\Http\Request\Kuliah\UpdateKuliahRequest;
use Modules\MySQL\Models\Kuliah;
use Modules\MySQL\Services\KuliahService;

class KuliahController extends Controller
{
    protected KuliahService $kuliahService;

    public function __construct(KuliahService $kuliahService)
    {
        $this->kuliahService = $kuliahService;
    }

    public function index(Request $request)
    {
        return Inertia::render('MySQL/KuliahIndex', [
            'kuliah' => $this->kuliahService->getKuliahPaginated($request),
            'filters' => $this->kuliahService->getAllKuliahFilter($request),
        ]);
    }

    public function details($id)
    {
        return Inertia::render('MySQL/KuliahDetails', [
            'kuliah' => $this->kuliahService->getKuliah($id),
        ]);
    }

    public function addPage()
    {
        return Inertia::render('MySQL/KuliahAdd', [
            'options' => $this->kuliahService->getAllOptions(),
        ]);
    }

    public function create(CreateKuliahRequest $request)
    {
        $this->kuliahService->createKuliah($request->validated());


        return redirect()
            ->route('mysql.kuliah.index')
            ->with('success', 'Kuliah Added Successfully.');
    }

    public function editPage(Kuliah $kuliah)
    {
        return Inertia::render('MySQL/KuliahEdit', [
            'kuliah' => $this->kuliahService->getKuliah($kuliah->id),
            'options' => $this->kuliahService->getAllOptions(),
        ]);
    }

    public function update(UpdateKuliahRequest $request, Kuliah $kuliah)
    {
        $this->kuliahService->updateKuliah($kuliah, $request->validated());

        return redirect()
            ->route('mysql.kuliah.index')
            ->with('success', 'Kuliah updated successfully!');
    }

    public function delete(Kuliah $kuliah)
    {
        $this->kuliahService->deleteKuliah($kuliah);

        return redirect()
            ->route('mysql.kuliah.index')
            ->with('success', 'Kuliah Deleted Successfully.');
    }
}
