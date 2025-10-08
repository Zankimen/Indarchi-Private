<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Nwidart\Modules\Facades\Module;

class MenuServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },

            // Dynamic module menus
            'moduleMenus' => function () {
                $menus = collect();

                foreach (Module::allEnabled() as $module) {
                    $path = $module->getPath().'/config/menu.php';

                    if (file_exists($path)) {
                        $configMenus = require $path;
                        foreach ($configMenus as $menu) {
                            $menus->push($menu);
                        }
                    }
                }

                return [
                    'dashboard' => $menus->where('type', 'dashboard')->values(),
                    'project' => $menus->where('type', 'project')->values(),
                    'landing' => $menus->where('type', 'landing')->values(),
                ];
            },

        ]);
    }
}
