import { router } from '@inertiajs/react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import React from 'react';

interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "Logout"
}

const ModalComponent: React.FC<PanelModalProps> = ({ isOpen, onClose, type }) => {
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
      default: return null;
    }
  }

  return <Modal show={isOpen} onClose={onClose}>{renderModal()}</Modal>
}

export default ModalComponent;
