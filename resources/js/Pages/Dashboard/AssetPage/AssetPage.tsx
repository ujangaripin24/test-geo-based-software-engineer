import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, router, Head } from '@inertiajs/react';
import React, { useState } from 'react';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: string;
  region: { name: string };
  geojson?: string;
  meta: any;
}

interface Props {
  assets: { data: Asset[]; links: any };
  regions: { id: string; name: string }[];
  categories: string[];
  filters: { search?: string; category?: string };
}

const AssetPage: React.FC<Props> = ({ assets, regions, categories, filters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Asset | null>(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    region_id: '',
    category: 'road',
    status: 'active',
    geojson: '',
    meta: {},
  });

  const openCreateModal = () => {
    setEditData(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setEditData(asset);
    setData({
      name: asset.name,
      region_id: (asset as any).region_id || '',
      category: asset.category,
      status: asset.status,
      geojson: asset.geojson || '',
      meta: asset.meta || {},
    });
    setIsModalOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      put(route('assets.update', editData.id), {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      post(route('assets.store'), {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus aset ini secara soft-delete?')) {
      router.delete(route('assets.destroy', id));
    }
  };
  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Asset Management (Admin Console)</h2>}
    >
      <Head title="Asset Management" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex justify-between mb-6">
              <button
                onClick={openCreateModal}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                + Tambah Asset
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.data.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4">{asset.name}</td>
                      <td className="px-6 py-4 capitalize text-sm">{asset.category}</td>
                      <td className="px-6 py-4 text-sm">{asset.region?.name}</td>
                      <td className="px-6 py-4 text-sm">{asset.status}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button onClick={() => openEditModal(asset)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editData ? 'Edit Asset' : 'Tambah Asset Baru'}</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Asset</label>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" required />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kategori</label>
                  <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                    {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Region (Scoped)</label>
                <select
                  value={data.region_id}
                  onChange={e => setData('region_id', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="">Pilih Region</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <p className="text-[10px] text-gray-500 mt-1 italic">Hanya menampilkan region yang di-assign ke Anda</p>
                {errors.region_id && <div className="text-red-500 text-xs mt-1">{errors.region_id}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Geometry (GeoJSON)</label>
                <textarea
                  value={data.geojson}
                  onChange={e => setData('geojson', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm font-mono text-sm"
                  rows={6}
                  placeholder='{"type": "Point", "coordinates": [106.8, -6.2]}'
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">Format: Point, LineString, atau Polygon</p>
                {errors.geojson && <div className="text-red-500 text-xs mt-1">{errors.geojson}</div>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Batal</button>
                <button type="submit" disabled={processing} className="px-6 py-2 bg-indigo-600 text-white rounded-md">
                  {processing ? 'Menyimpan...' : 'Simpan Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>);
};

export default AssetPage;
