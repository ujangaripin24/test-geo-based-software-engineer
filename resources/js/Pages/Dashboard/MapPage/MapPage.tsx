import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import ModalComponent from './Component/Modal';
import L from 'leaflet';

const MapPage: React.FC = () => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

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

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: (e: any) => {
        L.DomEvent.stopPropagation(e);
        setSelectedData(feature.properties);
        setIsModalOpen(true);
      },
    });
  };

  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          MapPage Spasial Dashboard
        </h2>
      }
    >
      <Head title="MapPage Spasial Dashboard" />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (<>
          <MapContainer center={[-6.9147, 107.6098]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '80vh' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geojsonData && (
              <GeoJSON
                data={geojsonData}
                style={geojsonStyle}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        </>)}
      </div>
      <ModalComponent
        show={isModalOpen}
        data={selectedData}
        onClose={() => setIsModalOpen(false)}
      />
    </Authenticated>
  )
}

export default MapPage