import { XMarkIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContextFile';

const QrModal = ({ qrCode, isModalOpen, setIsModalOpen }) => {
    const [storeName, setStoreName] = useState('Store');
    const { store } = useContext(AuthContext);

    useEffect(() => {
        if (!isModalOpen) return;
        const fetchUserName = async () => {
            try {
                if (store?.email) {
                    const res = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/auth/store/${store.email}`);
                    if (!res.ok) {
                        throw new Error(`Error: ${res.status} ${res.statusText}`);
                    }
                    const data = await res.json();
                    setStoreName(data.name || 'Store');
                }
            } catch (err) {
                console.error('Error fetching store name:', err);
                setStoreName('Store'); // Fallback to 'Store' if the API call fails
            }
        };

        fetchUserName();
    }, [store, isModalOpen]);

    if (!isModalOpen) return null;
    const handleDownload = () => {
        if (!qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `${storeName}-QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg text-center w-96">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {storeName} - QR Code
                    </h2>
                    <XMarkIcon className="w-6 h-6 cursor-pointer" onClick={() => setIsModalOpen(false)} />
                </div>
                {qrCode ? (
                    <img src={qrCode} alt="QR Code" className="mx-auto my-4 w-40 h-40" />
                ) : (
                    <p className="text-red-500">Error loading QR Code</p>
                )}
                <div className="flex justify-between mt-4">
                    <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded-md">
                        Download
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

QrModal.propTypes = {
    qrCode: PropTypes.string,
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default QrModal;