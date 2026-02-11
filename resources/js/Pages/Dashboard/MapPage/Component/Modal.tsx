import { Button, ModalHeader, ModalBody, ModalFooter, Modal } from 'flowbite-react';
import React from 'react'

interface ModalProps {
	show: boolean;
	onClose: () => void;
	data: any;
}

const ModalComponent: React.FC<ModalProps> = ({ show, onClose, data }) => {
	if (!data) return null;

	return (
		<Modal show={show} onClose={onClose} style={{zIndex: '400'}}>
			<ModalHeader>Detail Aset: {data.name}</ModalHeader>
			<ModalBody>
				<div className="space-y-4">
					<div className="flex justify-between border-b pb-2">
						<span className="font-semibold">Kategori:</span>
						<span>{data.category}</span>
					</div>
					<div className="flex justify-between border-b pb-2">
						<span className="font-semibold">Status:</span>
						<span className="uppercase text-blue-600">{data.status}</span>
					</div>
				</div>
			</ModalBody>
			<ModalFooter>
				<button className='px-6 py-2 bg-blue-600 text-white rounded' onClick={onClose}>Tutup</button>
			</ModalFooter>
		</Modal>
	);
}

export default ModalComponent;
