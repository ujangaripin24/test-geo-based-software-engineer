import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const MapPage: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(route('assets.geojson'))
      .then((response) => {
        setGeojsonData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal memuat data peta:", error);
        setLoading(false);
      });
  }, []);

  const geojsonStyle = (feature: any) => {
    switch (feature.properties.category) {
      case 'road': return { color: "#3b82f6", weight: 5 };
      case 'building': return { color: "#ef4444", fillOpacity: 0.5 };
      default: return { color: "#10b981" };
    }
  };
  return (

    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          MapPage Dashboard
        </h2>
      }
    >
      <Head title="MapPage Dashboard" />
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '80vh' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.205, -0.19]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Authenticated>
  )
}

export default MapPage