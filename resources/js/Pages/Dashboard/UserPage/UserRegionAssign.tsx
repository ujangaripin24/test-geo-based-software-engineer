import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react'

interface Region {
  id: string;
  name: string;
  type: string;
}

interface Props {
  user: any;
  availableRegions: Region[];
}

const UserRegionAssign: React.FC<Props> = ({ user, availableRegions }) => {
  const currentRegionIds = user.regions.map((r: any) => r.id);

  const { data, setData, post, processing } = useForm({
    region_ids: currentRegionIds,
  });

  const toggleRegion = (id: string) => {
    const isSelected = data.region_ids.includes(id);
    if (isSelected) {
      setData('region_ids', data.region_ids.filter((item: string) => item !== id));
    } else {
      setData('region_ids', [...data.region_ids, id]);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('user-regions.store', user.id));
  };
  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Penugasan Wilayah: {user.name}</h2>}
    >
      <Head title={`Assign Region - ${user.name}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h3 className="text-lg font-medium">Pilih Wilayah Kerja</h3>
              <p className="text-sm text-gray-600">User ini hanya dapat melihat data pada wilayah yang dicentang di bawah ini.</p>
            </div>

            <form onSubmit={submit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {availableRegions.map((region) => (
                  <label key={region.id} className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                      checked={data.region_ids.includes(region.id)}
                      onChange={() => toggleRegion(region.id)}
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-gray-700">{region.name}</span>
                      <span className="text-xs text-gray-500 uppercase">{region.type}</span>
                    </div>
                  </label>
                ))}

                {availableRegions.length === 0 && (
                  <p className="text-gray-500 italic">Belum ada wilayah yang terdaftar di organisasi ini.</p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : 'Simpan Penugasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default UserRegionAssign