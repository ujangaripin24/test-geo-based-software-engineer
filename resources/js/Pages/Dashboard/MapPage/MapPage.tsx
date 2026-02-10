import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import React from 'react'

const MapPage: React.FC = () => {
  const position = [51.505, -0.09];
  return (

    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          MapPage Dashboard
        </h2>
      }
    >
      <Head title="MapPage Dashboard" />MapPage</Authenticated>
  )
}

export default MapPage