import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

const PaginationMap: React.FC = () => {
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Spatial Pagination & Performance Scaling
        </h2>
      }
    >
      <Head title="Spatial Pagination & Performance Scaling" />
      <div>
        <MapContainer center={[-6.9147, 107.6098]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>
    </Authenticated>
  )
}

export default PaginationMap