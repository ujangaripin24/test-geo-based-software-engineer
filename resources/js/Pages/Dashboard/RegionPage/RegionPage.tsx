import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Head, useForm } from "@inertiajs/react"
import React from "react";

const RegionPage: React.FC = ({ regions, types, filters }: any) => {
  const { data, setData, post, delete: destroy, reset, processing, errors } = useForm({
    name: '',
    type: 'custom',
    geojson: ''
  });

  const submitRegion = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('regions.store'), {
      onSuccess: () => reset(),
      onError: (err: any) => {
        if (err.geojson) alert("Format GeoJSON tidak valid!");
      }
    });
  };
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          RegionPage Dashboard
        </h2>
      }
    >
      <Head title="RegionPage Dashboard" />
      <div className="py-12 px-4 max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Tambah Wilayah (Polygon)</h3>
          <form onSubmit={submitRegion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="text" placeholder="Nama Wilayah"
                value={data.name} onChange={e => setData('name', e.target.value)}
                className="w-full rounded border-gray-300 dark:bg-gray-900 dark:text-white"
              />
              <select
                value={data.type} onChange={e => setData('type', e.target.value)}
                className="w-full rounded border-gray-300 dark:bg-gray-900 dark:text-white"
              >
                {types.map((t: string) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <textarea
                placeholder='Paste GeoJSON Polygon di sini... Contoh: {"type":"Polygon","coordinates":[[[lng,lat],...]]}'
                value={data.geojson} onChange={e => setData('geojson', e.target.value)}
                className="w-full h-24 rounded border-gray-300 dark:bg-gray-900 dark:text-white font-mono text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={processing} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Simpan Wilayah Spasial
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="w-full text-left dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Data Spasial (GeoJSON)</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {regions.data.map((region: any) => (
                <tr key={region.id} className="border-t dark:border-gray-700 text-sm">
                  <td className="p-4 font-bold">{region.name}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">{region.type}</span></td>
                  <td className="p-4">
                    <code className="text-[10px] block max-w-xs truncate">{region.geojson}</code>
                  </td>
                  <td className="p-4">
                    <button onClick={() => confirm('Hapus wilayah?') && destroy(route('regions.destroy', region.id))} className="text-red-500">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Authenticated>
  )
}

export default RegionPage