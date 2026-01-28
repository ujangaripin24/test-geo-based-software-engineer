import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, router, useForm } from '@inertiajs/react';
import React, { useState } from 'react'

interface Org {
  id: string;
  name: string;
  code: string;
}

const OrganizationsPage: React.FC = ({ organizations, filters }: any) => {
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    name: '',
    code: ''
  });

  const [editId, setEditId] = useState<string | null>(null);

  const handleSearch = (e: any) => {
    router.get(route('dashboard.organizations'), {
      search: e.target.value
    }, {
      preserveState: true,
      replace: true,
    })
    console.log("data", e);
  }

  const submitData = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      put(route('organizations.update', editId), { onSuccess: () => { setEditId(null); reset(); } });
    } else {
      post(route('organizations.store'), { onSuccess: () => reset() });
    }
  };
  return (
    <Authenticated
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Organizations Management
        </h2>
      }
    >
      <>
        <Head title='Organizations' />
        <div className=''>
          <div className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between mb-6">
              <input
                type="text"
                placeholder="Search name or code..."
                defaultValue={filters.search}
                onChange={handleSearch}
                className="rounded-md border-gray-300 dark:bg-gray-700 dark:text-white w-1/3"
              />
            </div>
            <form onSubmit={submitData} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow flex gap-4 items-end">
              <div className="flex-1">
                <label className="dark:text-gray-200">Name</label>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded border-gray-300 dark:bg-gray-900 dark:text-white" required />
              </div>
              <div className="flex-1">
                <label className="dark:text-gray-200">Code</label>
                <input type="text" value={data.code} onChange={e => setData('code', e.target.value)} className="w-full rounded border-gray-300 dark:bg-gray-900 dark:text-white" required />
              </div>
              <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {editId ? 'Update' : 'Create'}
              </button>
              {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="px-6 py-2 bg-gray-500 text-white rounded">Cancel</button>}
            </form>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="w-full text-left dark:text-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Code</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.data.map((org: Org) => (
                  <tr key={org.id} className="border-t dark:border-gray-700">
                    <td className="p-4">{org.name}</td>
                    <td className="p-4">{org.code}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => { setEditId(org.id); setData({ name: org.name, code: org.code }); }} className="text-yellow-500">Edit</button>
                      <button onClick={() => confirm('Delete?') && destroy(route('organizations.destroy', org.id))} className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex gap-2">
            {organizations.links.map((link: any, i: number) => (
              <button
                key={i}
                dangerouslySetInnerHTML={{ __html: link.label }}
                onClick={() => link.url && router.get(link.url)}
                className={`px-4 py-2 border rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 dark:text-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </>
    </Authenticated>
  )
}

export default OrganizationsPage