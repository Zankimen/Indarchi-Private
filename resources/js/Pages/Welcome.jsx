import React from 'react';
import { Link } from '@inertiajs/react';

import Dashboard from '../layout/Dashboard';
import { Card } from '@/components/ui/card';

function Welcome() {
    return (
        <div className=" flex items-center justify-center h-full"   >
            asdw
        </div>
    );
}

Welcome.layout = (page) => <Dashboard children={page} title={"Kuliah"} />;

export default Welcome;