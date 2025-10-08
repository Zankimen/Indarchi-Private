<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\MenuServiceProvider::class,

    Modules\MySQL\Providers\MySQLServiceProvider::class,
    Modules\Peran\Providers\PeranServiceProvider::class,
    Modules\Project\Providers\ProjectServiceProvider::class,
];
