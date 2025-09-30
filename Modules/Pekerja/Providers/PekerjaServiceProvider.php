<?php


namespace Modules\Pekerja\Providers;

use Illuminate\Support\ServiceProvider;

class PekerjaServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            module_path('Pekerja', 'config/config.php'),
            'pekerja'
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->loadMigrationsFrom(module_path('Pekerja', 'database/migrations'));
        $this->loadRoutesFrom(module_path('Pekerja', 'routes/web.php'));
        $this->loadViewsFrom(module_path('Pekerja', 'resources/views'), 'pekerja');
    }
}
