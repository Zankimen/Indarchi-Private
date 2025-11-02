<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Nwidart\Modules\Facades\Module;

class ShareModuleMenus
{
    public function handle(Request $request, Closure $next, ...$types)
    {
        $user = $request->user();

        $types = collect($types)->map(fn ($t) => trim($t))->filter()->values();
        $shareAll = $types->isEmpty();

        if (! $user) {
            $emptyMenus = [
                'dashboard' => [],
                'project' => [],
                'landing' => [],
            ];

            Inertia::share('moduleMenus', $shareAll ? $emptyMenus : collect($emptyMenus)->only($types->all())->toArray());

            return $next($request);
        }

        $cacheKey = 'menus_for_user_'.$user->id;

        $allMenus = cache()->remember($cacheKey, now()->addMinutes(30), function () use ($user) {
            $menus = collect();

            foreach (Module::allEnabled() as $module) {
                $path = $module->getPath().'/config/menu.php';

                if (! file_exists($path)) {
                    continue;
                }

                $configMenus = require $path;

                foreach ($configMenus as $menu) {
                    $permission = $menu['permission'] ?? null;

                    if ($permission && ! $user->can($permission)) {
                        continue;
                    }

                    if (! empty($menu['children'])) {
                        $menu['children'] = collect($menu['children'])
                            ->filter(fn ($child) => empty($child['permission']) || $user->can($child['permission']))
                            ->values()
                            ->toArray();
                    }

                    $menus->push($menu);
                }
            }

            return [
                'dashboard' => $menus->where('type', 'dashboard')->values(),
                'project' => $menus->where('type', 'project')->values(),
                'landing' => $menus->where('type', 'landing')->values(),
            ];
        });

        $menusToShare = $shareAll
            ? $allMenus
            : collect($allMenus)->only($types)->toArray();

        Inertia::share('moduleMenus', $menusToShare);

        return $next($request);
    }
}