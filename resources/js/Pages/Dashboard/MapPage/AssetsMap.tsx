import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useCallback, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';

const MapWatcher = ({ onBBoxChange }: { onBBoxChange: (bbox: any) => void }) => {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            onBBoxChange({
                south: bounds.getSouth(),
                west: bounds.getWest(),
                north: bounds.getNorth(),
                east: bounds.getEast(),
            });
        },
    });
    return null;
};
const AssetsMap: React.FC = () => {
    const [geojsonData, setGeojsonData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchAssets = useCallback(async (bbox: any) => {
        setLoading(true);
        try {
            const response = await axios.get(route('assets.spatial'), { params: bbox });
            setGeojsonData(response.data);
        } catch (error) {
            console.error("Spatial Query Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    return (
        <Authenticated header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Spatial Explorer (Task 9)</h2>}>
            <Head title="Spatial Map" />
            <div>
                {loading && (
                    <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded shadow-md text-sm font-bold">
                        Refreshing Spatial Data...
                    </div>
                )}

                <MapContainer center={[-6.9147, 107.6098]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '80vh' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <MapWatcher onBBoxChange={fetchAssets} />

                    {geojsonData && (
                        <GeoJSON
                            key={JSON.stringify(geojsonData)}
                            data={geojsonData}
                            onEachFeature={(feature, layer) => {
                                layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </Authenticated>
    )
}

export default AssetsMap