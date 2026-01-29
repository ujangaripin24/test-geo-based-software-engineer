import { useForm } from '@inertiajs/react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import React, { useEffect } from 'react';

interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "DeleteUser" | "FormUser";
  dataEdit?: any | null;
  organizations: any[];
  roles: string[];
}

const ModalComponent: React.FC<PanelModalProps> = ({ organizations, roles, isOpen, onClose, type, dataEdit }) => {
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    organization_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (dataEdit && type === 'FormUser') {
        setData({
          name: dataEdit.name || '',
          email: dataEdit.email || '',
          password: '',
          role: dataEdit.role || 'viewer',
          organization_id: dataEdit.organization_id || '',
        });
      } else {
        reset();
      }
    }
  }, [isOpen, dataEdit]);

  const submitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (dataEdit) {
      put(route('users.update', dataEdit.id), {
        onSuccess: () => { onClose(); reset(); }
      });
    } else {
      post(route('users.store'), {
        onSuccess: () => { onClose(); reset(); }
      });
    }
  };

  const confirmDelete = () => {
    if (dataEdit) {
      destroy(route('users.destroy', dataEdit.id), {
        onSuccess: () => onClose()
      });
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      {type === "DeleteUser" ? (
        <>
          <ModalHeader>Hapus User</ModalHeader>
          <ModalBody>
            <p>Yakin ingin menghapus <b>{dataEdit?.name}</b>? Tindakan ini tidak bisa dibatalkan.</p>
          </ModalBody>
          <ModalFooter>
            <button className="px-6 py-2 bg-red-600 text-white rounded" onClick={confirmDelete} disabled={processing}>Hapus</button>
            <button className="px-6 py-2 bg-gray-500 text-white rounded" onClick={onClose}>Batal</button>
          </ModalFooter>
        </>
      ) : (
        <form onSubmit={submitUser}>
          <ModalHeader>{dataEdit ? 'Update' : 'Tambah'} User</ModalHeader>
          <ModalBody className="space-y-4 flex flex-col">
            <input type="text" placeholder="Name" value={data.name} onChange={e => setData('name', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required />
            <input type="email" placeholder="Email" value={data.email} onChange={e => setData('email', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required />
            <input type="password"
              placeholder={dataEdit ? "Kosongkan jika tidak ingin ganti" : "Password"}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              className="rounded dark:bg-gray-900 dark:text-white"
              required={!dataEdit}
            />
            <select value={data.organization_id} onChange={e => setData('organization_id', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white" required>
              <option value="">Select Organization</option>
              {organizations.map((org: any) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
            <select value={data.role} onChange={e => setData('role', e.target.value)} className="rounded dark:bg-gray-900 dark:text-white">
              {roles.map((r: string) => <option key={r} value={r}>{r}</option>)}
            </select>
          </ModalBody>
          <ModalFooter>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded" disabled={processing}>
              {dataEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>
            <button type="button" className="px-6 py-2 bg-red-600 text-white rounded" onClick={onClose}>Batal</button>
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}

export default ModalComponent;
