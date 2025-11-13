<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ResetProjectTeamContext
{
    public function handle(Request $request, Closure $next)
    {
        setTeamId(null);

        return $next($request);
    }
}
