import { router } from '@inertiajs/react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import React, { useState } from 'react'

interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const ModalComponent: React.FC<PanelModalProps> = ({ isOpen, onClose, type }) => {
  const [openModal, setOpenModal] = useState(false);

  const confirmExit = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => onClose()
    });
  }

  const renderModal = () => {
    switch (type) {
      case "Logout":
        return (
          <>
            <ModalHeader>Konfirmasi Logout</ModalHeader>
            <ModalBody>
              <p>Apakah anda yakin ingin keluar dari sistem?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="failure" onClick={confirmExit}>Ya, Keluar</Button>
              <Button color="gray" onClick={onClose}>Batal</Button>
            </ModalFooter>
          </>
        )

      default:
        return (
          <>
            <ModalHeader>Terms of Service</ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                  companies around the world are updating their terms of service agreements to comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
                  to ensure a common set of data rights in the European Union. It requires organizations to notify users as
                  soon as possible of high-risk data breaches that could personally affect them.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setOpenModal(false)}>I accept</Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                Decline
              </Button>
            </ModalFooter>
          </>
        )
    }
  }

  return (
    <>
      <Modal show={isOpen} onClose={onClose}>
        {renderModal()}
      </Modal>
    </>
  )
}

export default ModalComponent