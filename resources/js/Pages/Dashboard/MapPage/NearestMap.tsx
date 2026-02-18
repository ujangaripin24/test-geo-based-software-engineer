import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios';
import React, { useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents } from 'react-leaflet';

const NearestMap: React.FC = () => {
  const [nearestAssets, setNearestAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [point, setPoint] = useState<[number, number] | null>(null);

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPoint([lat, lng]);
        setLoading(true);

        try {
          const response = await axios.get(route('assets.nearest'), {
            params: { lat, lng, limit: 5 }
          });
          setNearestAssets(response.data.features);
        } catch (error) {
          console.error("KNN Search Error:", error);
        } finally {
          setLoading(false);
        }
      },
    });
    return null;
  };
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Nearest Neighbor (KNN Search)
        </h2>
      }
    >
      <Head title="Nearest Neighbor (KNN Search)" />
      <div className='py-6'>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 shadow sm:rounded-lg md:col-span-1">
            <h3 className="font-bold mb-4 text-gray-700">5 Terdekat (KNN)</h3>
            {loading ? (
              <p className="text-sm text-blue-500 animate-pulse">Menghitung jarak...</p>
            ) : nearestAssets.length > 0 ? (
              <ul className="space-y-3">
                {nearestAssets.map((asset, idx) => (
                  <li key={asset.properties.id} className="border-b pb-2">
                    <p className="font-semibold text-sm">{idx + 1}. {asset.properties.name}</p>
                    <p className="text-xs text-indigo-600 font-mono">
                      {asset.properties.distance_meter} meter
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">Klik pada peta untuk mencari aset terdekat.</p>
            )}
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-[70vh] md:col-span-3 relative">
            <MapContainer center={[-6.9147, 107.6098]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapEvents />
              {point && (
                <Marker position={point}>
                  <Popup>Titik Pencarian</Popup>
                </Marker>
              )}
              {nearestAssets.length > 0 && (
                <GeoJSON
                  key={JSON.stringify(nearestAssets)}
                  data={{ type: 'FeatureCollection', features: nearestAssets }}
                  onEachFeature={(feature, layer) => {
                    layer.bindPopup(`
                      <strong>${feature.properties.name}</strong><br/>
                      Jarak: ${feature.properties.distance_meter}m
                    `);
                  }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </Authenticated>
  )
}

export default NearestMap