<?php

namespace Modules\Project\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Project\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index() 
    {
        $projects = Project::latest()->get();
        return Inertia::render('Project/ProjectIndex', [
            'users' => 'fatih',
            'projects' => $projects,
        ]);
    }
     public function create()
    {
        return Inertia::render('Project/ProjectCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'radius' => 'required|numeric',
        ]);

        Project::create($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil ditambahkan');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Project/ProjectEdit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'nama' => 'required',
            'deskripsi' => 'nullable',
            'lokasi' => 'required',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date',
            'radius' => 'required|numeric',
        ]);

        $project->update($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil diperbarui.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted!');
    }
}
