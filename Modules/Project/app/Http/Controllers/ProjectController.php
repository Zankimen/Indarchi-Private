<?php

namespace Modules\Project\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Project\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        // Ambil data project dengan pagination
        $projects = Project::query()
            ->when($request->search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%");
            })
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_direction', 'desc'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Project/ProjectIndex', [
            'projects' => $projects,
            'filters'  => $this->getAllProjectFilter($request),
        ]);
    }

    public function create()
    {
        return Inertia::render('Project/ProjectCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'            => 'required|string|max:255',
            'deskripsi'       => 'nullable|string',
            'lokasi'          => 'required|string|max:255',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'radius'          => 'required|numeric',
        ]);

        Project::create($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil ditambahkan.');
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
            'nama'            => 'required|string|max:255',
            'deskripsi'       => 'nullable|string',
            'lokasi'          => 'required|string|max:255',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'radius'          => 'required|numeric',
        ]);

        $project->update($request->all());

        return redirect()->route('projects.index')->with('success', 'Project berhasil diperbarui.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus.');
    }
    public function show(Project $project)
    {
        return Inertia::render('Project/ProjectDetail', [
            'project' => $project,
        ]);
    }

    private function getAllProjectFilter(Request $request)
    {
        return [
            'search'          => $request->search,
            'sort_by'         => $request->sort_by,
            'sort_direction'  => $request->sort_direction,
            'nama'            => $request->nama,
            'deskripsi'       => $request->deskripsi,
            'tanggal_mulai'   => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi'          => $request->lokasi,
            'radius'          => $request->radius,
        ];
    }
}
