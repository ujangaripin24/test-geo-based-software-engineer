import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'
import { MapContainer, TileLayer, useMapEvents, Circle, GeoJSON } from 'react-leaflet'

const NearbyMap: React.FC = () => {
  const [nearbyData, setNearbyData] = useState<any>(null);
  const [clickPos, setClickPos] = useState<{ lat: number, lng: number } | null>(null)
  const [radius] = useState(2000)
  const [loading, setLoading] = useState(false)

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng
        setClickPos({ lat, lng })
        setLoading(true)

        try {
          const response = await axios.get(route('assets.nearby'), {
            params: { lat, lng, radius }
          })
          setNearbyData(response.data)
        } catch (error) {
          console.error("Gagal scan radius:", error)
        } finally {
          setLoading(false)
        }
      },
    })
    return null
  }

  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Proximity & Radius Search
        </h2>
      }
    >
      <Head title="Proximity & Radius Search" />
      <div>
        {loading && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white px-4 py-1 rounded-full text-sm shadow-lg">
            Scanning Spatial Data...
          </div>
        )}
        <MapContainer center={[-6.9147, 107.6098]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '80vh' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          {clickPos && (
            <Circle
              center={[clickPos.lat, clickPos.lng]}
              radius={radius}
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            />
          )}

          {nearbyData && (
            <GeoJSON
              key={JSON.stringify(nearbyData)}
              data={nearbyData}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(`
                            <div class="p-1">
                              <p class="font-bold">${feature.properties.name}</p>
                              <p class="text-xs">Kategori: ${feature.properties.category}</p>
                            </div>
                          `)
              }}
            />
          )}
        </MapContainer>
      </div>
    </Authenticated>
  )
}

export default NearbyMap