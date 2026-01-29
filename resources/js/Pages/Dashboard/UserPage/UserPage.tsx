import { Head, router } from '@inertiajs/react'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Users {
  id: string;
  name: string;
  password: string;
  email: string;
  role: string;
  organization_id: string;
}

const UserPage: React.FC = ({ users, filters }: any) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "DeleteUser" | "FormUser";
    data: Users | null;
  }>({
    isOpen: false,
    type: "FormUser",
    data: null
  });

  const openModal = (type: "DeleteUser" | "FormUser", data: Users | null = null) => {
    setModalConfig({ isOpen: true, type, data });
  }

  const handleSearch = (e: any) => {
    router.get(route('users.index'), { search: e.target.value }, {
      preserveState: true,
      replace: true
    });
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          User Management
        </h2>
      }
    >
      <Head title="Dashboard" />
      <div className="py-12 px-4 max-w-7-1 mx-auto">
        <div className="flex justify-between mb-6">
          <input
            type='text'
            placeholder='Search name or email...'
            defaultValue={filters.search}
            onChange={handleSearch}
            className='rounded'
          />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <table className="w-full text-left dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((item: Users) => (
                <tr key={item.id} className="border-t dark:border-gray-700">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.email}</td>
                  <td className="p-4">{item.role}</td>
                  <td className="p-4 text-center space-x-4">
                    <button onClick={() => openModal("FormUser", item)} className="text-yellow-500 hover:underline">Edit</button>
                    <button onClick={() => openModal("DeleteUser", item)} className="text-red-500 hover:underline">Delete</button>
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
    </AuthenticatedLayout>
  )
}

export default UserPage