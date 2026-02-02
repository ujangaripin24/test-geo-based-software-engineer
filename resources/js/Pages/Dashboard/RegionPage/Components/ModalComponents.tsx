import { useForm } from '@inertiajs/react';
import { ModalHeader, ModalBody, ModalFooter, Modal } from 'flowbite-react';
import React, { useEffect } from 'react'

interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "DeleteRegion" | "FormRegion";
  dataEdit?: { id: string; name: string; type: string; geojson: string } | null;
}

const ModalComponents: React.FC<PanelModalProps> = ({ isOpen, onClose, type, dataEdit }) => {
  const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
    name: '',
    type: '',
    geojson: ''
  });

  useEffect(() => {
    if (dataEdit && type === "FormRegion") {
      setData({ name: dataEdit.name, type: dataEdit.type, geojson: dataEdit.geojson });
    } else {
      reset();
    }
  }, [dataEdit, isOpen]);

  const handleSubmitRegion = (e: React.FormEvent) => {
    e.preventDefault();
    if (dataEdit) {
      put(route('regions.update', dataEdit.id), { onSuccess: () => onClose() });
    } else {
      post(route('regions.store'), { onSuccess: () => onClose() });
    }
  };

  const confirmDelete = () => {
    if (dataEdit) {
      destroy(route('regions.destroy', dataEdit.id), { onSuccess: () => onClose() });
      console.log(data.name);
    }
  };

  const renderModal = () => {
    switch (type) {
      case "DeleteRegion":
        return (
          <>
            <ModalHeader>Hapus Organisasi Component</ModalHeader>
            <ModalBody><p>Yakin ingin menghapus <b>{dataEdit?.name}</b>? Tindakan ini tidak bisa dibatalkan.</p></ModalBody>
            <ModalFooter>
              <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={confirmDelete} disabled={processing}>Hapus</button>
              <button className="px-6 py-2 bg-red-600 text-white rounded" onClick={onClose}>Batal</button>
            </ModalFooter>
          </>);
      case "FormRegion":
        return (
          <>
            <ModalHeader>Hapus Organisasi Component <b>{dataEdit?.name}</b></ModalHeader>
          </>);
      default: return null;
    }
  }
  return <Modal show={isOpen} onClose={onClose}>{renderModal()}</Modal>
}

export default ModalComponents