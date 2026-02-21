import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const LeafletRouteMap: React.FC = () => {
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Spatial Pagination (Task 12)
        </h2>
      }
    >
      <Head title="Spatial Pagination" />
      <div className="py-6">LeafletRouteMap</div></Authenticated>
  )
}

export default LeafletRouteMap