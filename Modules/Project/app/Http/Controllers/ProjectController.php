<?php

namespace Modules\Project\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;
use Modules\Project\Models\Project;
use Modules\Project\Services\ProjectService;
use Modules\Project\Http\Requests\Project\CreateProjectRequest;
use Modules\Project\Http\Requests\Project\UpdateProjectRequest;

class ProjectController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
<<<<<<< HEAD
        $projects = Project::query()
            ->when($request->search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%")
                    ->orWhere('client', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            })
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Project/ProjectIndex', [
            'projects' => $projects,
            'filters'  => $this->getAllProjectFilter($request),
        ]);
=======
        try {
            return Inertia::render('Project/ProjectIndex', [
                'projects' => $this->projectService->getProjectsPaginated($request),
                'filters'  => $this->projectService->getAllProjectFilter($request),
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
>>>>>>> 0b4510b5b6d2f77a40014e199c92c41bf6580c11
    }

    public function store(CreateProjectRequest $request)
    {
        try {
            $this->projectService->createProject($request->validated());

<<<<<<< HEAD
    public function store(Request $request)
    {
        $request->validate([
            'nama'            => 'required|string|max:255',
            'deskripsi'       => 'nullable|string',
            'client'          => 'required|string|max:255',
            'status'          => 'required|string|max:100',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'radius'          => 'required|numeric',
            'lokasi'          => 'required|string', // sementara string, nanti bisa ubah ke POINT
        ]);

        Project::create($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil ditambahkan.');
=======
            return redirect()->route('projects.index')->with('success', 'Project berhasil ditambahkan.');
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
>>>>>>> 0b4510b5b6d2f77a40014e199c92c41bf6580c11
    }

    public function edit(Project $project)
    {
        return Inertia::render('Project/ProjectEdit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
<<<<<<< HEAD
        $request->validate([
            'nama'            => 'required|string|max:255',
            'deskripsi'       => 'nullable|string',
            'client'          => 'required|string|max:255',
            'status'          => 'required|string|max:100',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'radius'          => 'required|numeric',
            'lokasi'          => 'required|string',
        ]);
=======
        try {
            $this->projectService->updateProject($project, $request->validated());
>>>>>>> 0b4510b5b6d2f77a40014e199c92c41bf6580c11

            return redirect()->route('projects.index')->with('success', 'Project berhasil diperbarui.');
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(Project $project)
    {
        try {
            $this->projectService->deleteProject($project);

            return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus.');
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Project $project)
    {
        return Inertia::render('Project/ProjectDetail', [
            'project' => $project,
        ]);
    }
<<<<<<< HEAD

    private function getAllProjectFilter(Request $request)
    {
        return [
            'search'          => $request->search,
            'sort_by'         => $request->sort_by,
            'sort_direction'  => $request->sort_direction,
            'nama'            => $request->nama,
            'deskripsi'       => $request->deskripsi,
            'client'          => $request->client,
            'status'          => $request->status,
            'tanggal_mulai'   => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi'          => $request->lokasi,
            'radius'          => $request->radius,
        ];
    }
}
=======
}
>>>>>>> 0b4510b5b6d2f77a40014e199c92c41bf6580c11
