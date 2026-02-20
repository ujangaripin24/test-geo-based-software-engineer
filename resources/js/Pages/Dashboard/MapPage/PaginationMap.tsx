import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React, { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const PaginationMap: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [viewport, setViewport] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchPaginatedAssets = useCallback(async (currentViewport: any, currentPage: number) => {
    if (!currentViewport) return
    setLoading(true)
    try {
      const response = await axios.get(route('assets.index'), {
        params: {
          ...currentViewport,
          page: currentPage,
          per_page: 50
        }
      })
      setAssets(response.data.data)
      setMeta(response.data.meta)
    } catch (error) {
      console.error("Pagination Error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const MapWatcher = () => {
    useMapEvents({
      moveend: (e) => {
        const map = e.target
        const bounds = map.getBounds()
        const newViewport = {
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast()
        }
        setViewport(newViewport)
        setPage(1)
        fetchPaginatedAssets(newViewport, 1)
      }
    })
    return null
  }

  useEffect(() => {
    if (viewport && page > 1) {
      fetchPaginatedAssets(viewport, page)
    }
  }, [page])

  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Spatial Pagination (Task 12)
        </h2>
      }
    >
      <Head title="Spatial Pagination" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          <div className="mb-4 flex items-center justify-between bg-white p-4 rounded shadow-sm">
            <div className="text-sm text-gray-600">
              Total di Viewport: <strong>{meta?.total || 0}</strong> aset
              {meta && ` (Halaman ${meta.page} dari ${meta.last_page})`}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm font-medium"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!meta || page >= meta.last_page || loading}
                className="px-4 py-1 bg-indigo-600 text-white rounded disabled:opacity-50 text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-[65vh] relative">
            {loading && (
              <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-1 rounded shadow text-xs font-bold animate-pulse">
                Loading Page {page}...
              </div>
            )}

            <MapContainer
              center={[-6.9147, 107.6098]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapWatcher />

              {assets.map((asset: any) => (
                <GeoJSON
                  key={`${asset.id}-${page}`}
                  data={JSON.parse(asset.geojson)}
                  onEachFeature={(_, layer) => {
                    layer.bindPopup(`<strong>${asset.name}</strong><br/>ID: ${asset.id}`);
                  }}
                />
              ))}
            </MapContainer>
          </div>
          <p className="mt-2 text-xs text-gray-500 italic">
            *Gunakan tombol Next/Prev jika jumlah aset di wilayah ini melebihi 50 data.
          </p>
        </div>
      </div>
    </Authenticated>
  )
}

export default PaginationMap