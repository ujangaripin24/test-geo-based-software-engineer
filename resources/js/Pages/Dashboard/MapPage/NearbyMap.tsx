import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const NearbyMap: React.FC = () => {
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          MapPage Dashboard
        </h2>
      }
    >
      <Head title="MapPage Dashboard" />
      <div>NearbyMap</div>
    </Authenticated>
  )
}

export default NearbyMap