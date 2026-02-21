import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import L, { TileLayer } from 'leaflet';
import { MapContainer, useMapEvents, GeoJSON } from 'react-leaflet';

const MarkerClusterMap: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchClusters = useCallback(async (map: L.Map) => {
    const bounds = map.getBounds();
    const zoom = map.getZoom();

    setLoading(true);
    try {
      const response = await axios.get(route('assets.cluster'), {
        params: {
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
          zoom: zoom
        }
      });
      setGeojsonData(response.data);
    } catch (error) {
      console.error("Clustering Error:", error)
    } finally {
      setLoading(false)
    }
  }, []);

  const MapWatcher = () => {
    const map = useMapEvents({
      moveend: () => fetchClusters(map),
      zoomend: () => fetchClusters(map),
    })
    return null
  }

  const createClusterIcon = (count: number) => {
    const size = count < 10 ? 30 : count < 100 ? 40 : 50
    const color = count < 10 ? 'bg-blue-500' : count < 100 ? 'bg-yellow-500' : 'bg-red-500'

    return L.divIcon({
      html: `<div class="${color} text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white" 
                   style="width: ${size}px; height: ${size}px;">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(size, size),
    })
  }

  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          MapPage Marker Cluster Dashboard
        </h2>
      }
    >
      <Head title="MapPage Marker Cluster Dashboard" />
      <div>
        {loading ? (
          <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow text-xs animate-bounce">
            Calculating Clusters...
          </div>
        ) : (
          <>
            <MapContainer center={[-6.9147, 107.6098]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '80vh' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapWatcher />
              {geojsonData && (
                <GeoJSON
                  key={JSON.stringify(geojsonData)}
                  data={geojsonData}
                  pointToLayer={(feature, latlng) => {
                    if (feature.properties.type === 'cluster') {
                      return L.marker(latlng, { icon: createClusterIcon(feature.properties.count) })
                    }
                    return L.marker(latlng)
                  }}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties.type === 'cluster') {
                      layer.bindPopup(`Cluster: ${feature.properties.count} Assets`)
                    } else {
                      layer.bindPopup(`Asset: ${feature.properties.name}`)
                    }
                  }}
                />
              )}
            </MapContainer>
          </>
        )}
      </div>
    </Authenticated>
  )
}

export default MarkerClusterMap