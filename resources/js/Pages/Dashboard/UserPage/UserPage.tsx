import { Head, router, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ModalComponent from './Components/ModalComponent';

interface Users {
  organization: any;
  id: string;
  name: string;
  password: string;
  email: string;
  role: string;
  organization_id: string;
}

const UserPage: React.FC = ({ users, organizations, roles, filters }: any) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "DeleteUser" | "FormUser";
    data: any | null;
  }>({
    isOpen: false,
    type: "FormUser",
    data: null
  });

  const openModal = (type: "DeleteUser" | "FormUser", data: any = null) => {
    setModalConfig({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSearch = (e: any) => {
    router.get(route('users.index'), { search: e.target.value }, { preserveState: true, replace: true });
  };

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl dark:text-white">User Management</h2>}>
      <Head title="Users" />

      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search name or code..."
            defaultValue={filters.search}
            onChange={handleSearch}
            className="rounded-md border-gray-300 dark:bg-gray-700 dark:text-white w-1/3"
          />
          <button onClick={() => openModal("FormUser")} className="px-6 py-2 bg-blue-600 text-white rounded">Add Organization</button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
          <table className="w-full text-left dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4">Name / Email</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user: Users) => (
                <tr key={user.id} className="border-t dark:border-gray-700">
                  <td className="p-4">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4">{user.organization?.name || '-'}</td>
                  <td className="p-4 font-mono text-sm">{user.role}</td>
                  <td className="p-4 space-x-4 text-center">
                    <button onClick={() => openModal("FormUser", user)} className="text-blue-500 hover:underline">Edit</button>
                    <button onClick={() => openModal("DeleteUser", user)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex gap-2">
          {users.links.map((link: any, i: number) => (
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
        onClose={closeModal}
        type={modalConfig.type}
        dataEdit={modalConfig.data}
        organizations={organizations}
        roles={roles}
      />
    </AuthenticatedLayout>
  );
}

export default UserPage