<?php

return [
    [
        'title' => 'Template',
        'icon' => 'PackageIcon',
        'route' => '/mysql',
        'children' => [
            [
                'title' => 'Mahasiswa',
                'icon' => 'UsersIcon',
                'route' => '/mysql/mahasiswa',
            ],
            [
                'title' => 'Dosen',
                'icon' => 'UserStarIcon',
                'route' => '/mysql/dosen',
            ],
        ],
    ],
];
