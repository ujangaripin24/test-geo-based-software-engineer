import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const LeafletRouteMap: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [selection, setSelection] = useState<{ from: any | null, to: any | null }>({ from: null, to: null });
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(route('assets.index'), { params: { south: -10, west: 95, north: 10, east: 141 } })
      .then(res => setAssets(res.data.data));
  }, []);

  const calculateRoute = async (fromId: number, toId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(route('assets.route'), {
        params: { fromAssetId: fromId, toAssetId: toId }
      });
      setRouteData(response.data);
    } catch (error) {
      console.error("Routing Error:", error);
      alert("Gagal menghitung rute jalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssetClick = (asset: any) => {
    if (!selection.from || (selection.from && selection.to)) {
      setSelection({ from: asset, to: null });
      setRouteData(null);
    } else if (selection.from && !selection.to) {
      if (asset.id === selection.from.id) return;
      setSelection(prev => ({ ...prev, to: asset }));
      calculateRoute(selection.from.id, asset.id);
    }
  };

  return (
    <Authenticated header={<h2 className="font-semibold text-xl text-gray-800">Route Optimizer (OSRM Integration)</h2>}>
      <Head title="Asset Routing" />
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          <div className="mb-4 p-4 bg-white shadow rounded-lg flex justify-between items-center">
            <div className="text-sm">
              <span className="font-bold text-blue-600">From:</span> {selection.from?.name || '...'}
              <span className="mx-4">→</span>
              <span className="font-bold text-red-600">To:</span> {selection.to?.name || '...'}
            </div>
            {routeData && (
              <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                📏 {(routeData.distance_meters / 1000).toFixed(2)} km |
                ⏱️ {Math.round(routeData.duration_seconds / 60)} min
              </div>
            )}
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-[70vh] relative">
            {loading && <div className="absolute inset-0 z-[1001] bg-white/50 flex items-center justify-center font-bold">Calculating Route...</div>}

            <MapContainer center={[-6.9147, 107.6098]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {assets && assets.length > 0 && assets.map(asset => {
                const isSelected = selection.from?.id === asset.id || selection.to?.id === asset.id;
                return (
                  <Marker
                    key={asset.id}
                    position={[JSON.parse(asset.geojson).coordinates[1], JSON.parse(asset.geojson).coordinates[0]]}
                    eventHandlers={{ click: () => handleAssetClick(asset) }}
                    opacity={isSelected ? 1 : 0.6}
                  >
                    <Popup>{asset.name}</Popup>
                  </Marker>
                );
              })}

              {routeData && (
                <GeoJSON
                  key={JSON.stringify(routeData.geometry)}
                  data={routeData.geometry}
                  style={{ color: '#4f46e5', weight: 5, opacity: 0.7 }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default LeafletRouteMap;