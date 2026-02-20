import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const MarkerClusterMap: React.FC = () => {
    return (

        <Authenticated
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    MapPage Marker Cluster Dashboard
                </h2>
            }
        >
            <Head title="MapPage Marker Cluster Dashboard" />
            <div>Marker Cluster</div>
        </Authenticated>
    )
}

export default MarkerClusterMap