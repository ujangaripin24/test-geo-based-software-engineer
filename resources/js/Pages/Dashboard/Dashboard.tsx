import ModalComponent from '@/Components/ModalComponent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from 'flowbite-react';
import { useState } from 'react';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<string>('');

    const handleOpenModal = (type: string) => {
        setModalType(type);
        setIsModalOpen(true);
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>
                    <Button color="red" className='shadow-sm dark:text-gray-800' onClick={() => handleOpenModal('Logout')}>Keluar</Button>
                </div>
                <ModalComponent
                    isOpen={isModalOpen}
                    type={modalType}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
