import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import ModalComponent from './Components/ModalComponent';

interface Org {
  id: string;
  name: string;
  code: string;
}

const OrganizationsPage: React.FC = ({ organizations, filters }: any) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "DeleteOrg" | "FormOrg";
    data: Org | null;
  }>({
    isOpen: false,
    type: "FormOrg",
    data: null
  });

  const openModal = (type: "DeleteOrg" | "FormOrg", data: Org | null = null) => {
    setModalConfig({ isOpen: true, type, data });
  }

  const handleSearch = (e: any) => {
    router.get(route('organizations.index'), { search: e.target.value }, {
      preserveState: true,
      replace: true
    });
  };

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl dark:text-white">Organization Management</h2>}>
      <Head title="Organizations" />

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
        <button onClick={() => openModal("FormOrg")} className="px-6 py-2 bg-blue-600 text-white rounded">Add Organization</button>

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
                  <td className="p-4 text-center space-x-4">
                    <button onClick={() => openModal("FormOrg", org)} className="text-yellow-500 hover:underline">Edit</button>
                    <button onClick={() => openModal("DeleteOrg", org)} className="text-red-500 hover:underline">Delete</button>
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
      <ModalComponent
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        dataEdit={modalConfig.data}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </AuthenticatedLayout>
  );
}

export default OrganizationsPage;