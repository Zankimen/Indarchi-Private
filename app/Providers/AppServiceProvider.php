<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Ensure Blade compiled views cache directory exists to prevent
        // "Please provide a valid cache path." during package:discover.
        $compiledPath = config('view.compiled');

        if ($compiledPath && !is_dir($compiledPath)) {
            @mkdir($compiledPath, 0755, true);
        }

        // Optionally ensure common storage/framework subdirectories exist
        // so sessions/cache/views don't error on fresh installs.
        $frameworkDirs = [
            storage_path('framework'),
            storage_path('framework/cache'),
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('framework/testing'),
            storage_path('framework/views'),
        ];

        foreach ($frameworkDirs as $dir) {
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }
        }
    }
}
