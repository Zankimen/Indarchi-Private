<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\MenuServiceProvider::class,

    // Ensure module providers are explicitly registered so bindings are available
    Modules\MySQL\Providers\MySQLServiceProvider::class,
    Modules\Peran\Providers\PeranServiceProvider::class,
    Modules\Project\Providers\ProjectServiceProvider::class,
];
