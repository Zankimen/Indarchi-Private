<?php

namespace Modules\Project\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Project\Http\Requests\Project\CreateProjectRequest;
use Modules\Project\Http\Requests\Project\UpdateProjectRequest;
use Modules\Project\Models\Project;
use Modules\Project\Services\ProjectService;

class ProjectController extends Controller
{
    protected ProjectService $projectService;

    protected $SEE_OTHER = 303;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        try {
            return Inertia::render('Project/ProjectIndex', [
                'projects' => $this->projectService->getProjectsPaginated($request),
                'filters' => $this->projectService->getAllProjectFilter($request),
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function store(CreateProjectRequest $request)
    {
        try {
            $this->projectService->createProject($request->validated());

            return redirect()->route('projects.index')->with('success', 'Project berhasil ditambahkan.');
        } catch (Exception $e) {
            dd($e);
            return back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function create()
    {
        try {
            return Inertia::render('Project/ProjectCreate');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function edit(Project $project)
    {
        return Inertia::render('Project/ProjectEdit', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        try {
            $this->projectService->updateProject($project, $request->validated());

            return back($this->SEE_OTHER)->with('success', 'Project berhasil diperbarui.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(Project $project)
    {
        try {
            $project->delete();

            return back($this->SEE_OTHER)
                ->with('success', 'Project berhasil dihapus.');
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Project $project)
    {
        try {
            return Inertia::render('Project/ProjectDetail', [
                'project' => $project,
            ]);
        } catch (Exception $e) {
            return back($this->SEE_OTHER)
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
