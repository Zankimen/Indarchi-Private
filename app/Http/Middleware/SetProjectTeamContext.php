<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Project\Models\Project;

class SetProjectTeamContext
{
    public function handle(Request $request, Closure $next)
    {
        $projectId = $request->route('project_id') ?? $request->route('project');

        if ($projectId) {
            $projectId = $projectId instanceof Project ? $projectId->id : $projectId;

            setTeamId($projectId);
        }

        return $next($request);
    }
}
