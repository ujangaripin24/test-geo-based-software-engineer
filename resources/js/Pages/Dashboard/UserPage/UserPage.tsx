import { Head, router, useForm } from '@inertiajs/react'
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

const UserPage: React.FC = ({users, organizations, roles, filters }: any) => {
  const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
    name: '', email: '', password: '', organization_id: '', role: 'viewer'
  });

  const [editId, setEditId] = useState<number | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      put(route('users.update', editId), { onSuccess: () => { setEditId(null); reset(); } });
    } else {
      post(route('users.store'), { onSuccess: () => reset() });
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl dark:text-white">User Management</h2>}>
      <Head title="Users" />

      <div className="py-12 px-4 max-w-7xl mx-auto">
        <form onSubmit={submit} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={data.name} onChange={e => setData('name', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required />
          <input type="email" placeholder="Email" value={data.email} onChange={e => setData('email', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required />
          <input type="password" placeholder={editId ? "Leave blank to keep current" : "Password"} value={data.password} onChange={e => setData('password', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required={!editId} />

          <select value={data.organization_id} onChange={e => setData('organization_id', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required>
            <option value="">Select Organization</option>
            {organizations.map((org: any) => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>

          <select value={data.role} onChange={e => setData('role', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white">
            {roles.map((r: string) => <option key={r} value={r}>{r}</option>)}
          </select>

          <div className="col-span-2 flex gap-2">
            <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded">{editId ? 'Update User' : 'Create User'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>

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
              {users.data.map((user: any) => (
                <tr key={user.id} className="border-t dark:border-gray-700">
                  <td className="p-4">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4">{user.organization?.name || '-'}</td>
                  <td className="p-4 font-mono text-sm">{user.role}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => {
                      setEditId(user.id);
                      setData({ name: user.name, email: user.email, password: '', organization_id: user.organization_id, role: user.role });
                    }} className="text-blue-500">Edit</button>
                    <button onClick={() => confirm('Delete user?') && destroy(route('users.destroy', user.id))} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default UserPage