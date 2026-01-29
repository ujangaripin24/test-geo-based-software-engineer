import { router, useForm } from '@inertiajs/react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react';

interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "Logout" | "DeleteOrg" | "FormOrg";
  dataEdit?: { id: string; name: string; code: string } | null;
}

const ModalComponent: React.FC<PanelModalProps> = ({ isOpen, onClose, type, dataEdit }) => {
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    name: '',
    code: ''
  });

  useEffect(() => {
    if (dataEdit && type === "FormOrg") {
      setData({ name: dataEdit.name, code: dataEdit.code });
    } else {
      reset();
    }
  }, [dataEdit, isOpen]);

  const handleSubmitOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (dataEdit) {
      put(route('organizations.update', dataEdit.id), { onSuccess: () => onClose() });
    } else {
      post(route('organizations.store'), { onSuccess: () => onClose() });
    }
  };

  const confirmDelete = () => {
    if (dataEdit) {
      destroy(route('organizations.destroy', dataEdit.id), { onSuccess: () => onClose() });
    }
  };

  const confirmLogout = () => {
    router.post(route('logout'), {}, { onSuccess: () => onClose() });
  };

  const renderModal = () => {
    switch (type) {
      case "Logout":
        return (
          <>
            <ModalHeader>Konfirmasi Logout</ModalHeader>
            <ModalBody><p>Apakah anda yakin ingin keluar dari sistem?</p></ModalBody>
            <ModalFooter>
              <Button color="failure" onClick={confirmLogout}>Ya, Keluar</Button>
              <Button color="gray" onClick={onClose}>Batal</Button>
            </ModalFooter>
          </>
        );
      case "DeleteOrg":
        return (
          <>
            <ModalHeader>Hapus Organisasi</ModalHeader>
            <ModalBody><p>Yakin ingin menghapus <b>{dataEdit?.name}</b>? Tindakan ini tidak bisa dibatalkan.</p></ModalBody>
            <ModalFooter>
              <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={confirmDelete} disabled={processing}>Hapus</button>
              <button className="px-6 py-2 bg-red-600 text-white rounded" onClick={onClose}>Batal</button>
            </ModalFooter>
          </>
        );
      case "FormOrg":
        return (
          <form onSubmit={handleSubmitOrg}>
            <ModalHeader>{dataEdit ? 'Update' : 'Tambah'} Organisasi</ModalHeader>
            <ModalBody className="space-y-4">
              <div>
                <Label htmlFor="Nama Organisasi" />
                <TextInput value={data.name} onChange={e => setData('name', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="Kode" />
                <TextInput value={data.code} onChange={e => setData('code', e.target.value)} required />
              </div>
            </ModalBody>
            <ModalFooter>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded" disabled={processing}>{dataEdit ? 'Simpan Perubahan' : 'Simpan'}</button>
              <button className="px-6 py-2 bg-red-600 text-white rounded" onClick={onClose}>Batal</button>
            </ModalFooter>
          </form>
        );
      default: return null;
    }
  }

  return <Modal show={isOpen} onClose={onClose}>{renderModal()}</Modal>
}

export default ModalComponent;
