import React from 'react';
import { Link } from '@inertiajs/react';

import Dashboard from '../layout/Dashboard';
import { Card } from '@/components/ui/card';

function Welcome() {
    return (
        <div className="flex items-center justify-center">
            <Card className="border-border">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-primary font-semibold">
                        Sistem Terdistribusi
                    </div>
                    <h1 className="block mt-1 text-lg leading-tight font-medium">
                        Tugas 2 Membuat Aplikasi Yang Mengakses 2 Database
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Kelompok :
                    </p>
            </div>
            </Card>
        </div>
    );
}

Welcome.layout = (page) => <Dashboard children={page} />;

export default Welcome;