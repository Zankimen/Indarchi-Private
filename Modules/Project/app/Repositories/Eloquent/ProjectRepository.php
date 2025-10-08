<?php

namespace Modules\Project\Repositories\Eloquent;

use Modules\Project\Models\Project;
use Illuminate\Database\Eloquent\Builder;

class ProjectRepository
{
    public function all()
    {
        return Project::all();
    }

    public function find($id)
    {
        return Project::findOrFail($id);
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data)
    {
        return $project->update($data);
    }

    public function delete($id)
    {
        return Project::destroy($id);
    }

    public function getFilteredSortedAndSearched($request)
    {
        $query = Project::query();

        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['nama', 'lokasi', 'tanggal_mulai', 'tanggal_selesai', 'radius', 'created_at'];

        $sortBy = $request->get('sort_by', 'created_at');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'desc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (Builder $q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        if ($request->filled('nama')) {
            $query->where('nama', 'like', '%' . $request->nama . '%');
        }
        if ($request->filled('deskripsi')) {
            $query->where('deskripsi', 'like', '%' . $request->deskripsi . '%');
        }
        if ($request->filled('lokasi')) {
            $query->where('lokasi', 'like', '%' . $request->lokasi . '%');
        }
        if ($request->filled('tanggal_mulai')) {
            $query->whereDate('tanggal_mulai', '>=', $request->tanggal_mulai);
        }
        if ($request->filled('tanggal_selesai')) {
            $query->whereDate('tanggal_selesai', '<=', $request->tanggal_selesai);
        }
        if ($request->filled('radius')) {
            $query->where('radius', $request->radius);
        }

        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage)->withQueryString();
    }
}