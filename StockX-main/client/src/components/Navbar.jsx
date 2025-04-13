import { QrCodeIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../contexts/AuthContextFile'; // Import AuthContext

const Navbar = ({ activeView, setActiveView, setQrCode, setIsModalOpen }) => {
    const navigate = useNavigate();
    const year = new Date().getFullYear();
    const [storeName, setStoreName] = useState('Store');
    const { store } = useContext(AuthContext);


    // Fetch user's name from the backend
    useEffect(() => {
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
    }, [store]);

    // Fetch QR code
    const fetchQrCode = async () => {
        if (!store?.email) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/auth/store/qrcode/${store.email}`);
            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            setQrCode(`data:image/png;base64;${data.qrCode}`);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching QR code:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('storeEmail');
        navigate('/auth');
    };

    return (
        <div className="left-0 h-[80%] w-[26%] border-2 border-mlsa-sky-blue rounded-md text-white px-4 flex items-center flex-col justify-between">
            <div className='w-full'>
                <div className="text-center text-xl font-bold py-4">
                    StockX
                </div>
                <hr className="h-1 border-none bg-mlsa-sky-blue mb-4" />
                <div className="gap-3 flex items-center flex-col justify-center">
                    {/* Display the fetched user name */}
                    <div className="w-full bg-mlsa-sky-blue flex items-center justify-center font-bold text-black rounded-md py-[12px]">
                        <UserCircleIcon className="h-6 w-6 mr-1" />
                        {storeName}
                    </div>
                    <div className="w-full border-2 border-mlsa-sky-blue flex items-center justify-center font-semibold text-[0.8rem] text-white rounded-md py-[6px] transition duration-100 ease-in-out hover:bg-mlsa-sky-blue/20 cursor-pointer"
                        onClick={fetchQrCode}
                    >
                        Display QR Code <QrCodeIcon className="h-5 w-5 ml-2" />
                    </div>
                    <div className="w-full border-2 border-mlsa-sky-blue flex items-center justify-center font-semibold text-[0.8rem] text-white rounded-md py-[6px] transition duration-100 ease-in-out hover:bg-red-700 cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col items-center justify-center gap-3'>
                <div
                    className={`w-full flex items-center justify-center font-bold rounded-md py-[3px] transition duration-100 ease-in-out cursor-pointer ${activeView === 'dashboard' ? 'bg-mlsa-sky-blue text-black' : 'hover:bg-mlsa-sky-blue hover:text-black'}`}
                    onClick={() => setActiveView('dashboard')}
                >
                    Dashboard
                </div>
                <div
                    className={`w-full flex items-center justify-center font-bold rounded-md py-[3px] transition duration-100 ease-in-out cursor-pointer ${activeView === 'resourceTrading' ? 'bg-mlsa-sky-blue text-black' : 'hover:bg-mlsa-sky-blue hover:text-black'}`}
                    onClick={() => setActiveView('resourceTrading')}
                >
                    Stock Management
                </div>
                <div
                    className={`w-full flex items-center justify-center font-bold rounded-md py-[3px] transition duration-100 ease-in-out cursor-pointer ${activeView === 'purchases' ? 'bg-mlsa-sky-blue text-black' : 'hover:bg-mlsa-sky-blue hover:text-black'}`}
                    onClick={() => setActiveView('purchases')}
                >
                    Purchases
                </div>
            </div>
            <div className='w-full text-[0.7rem] text-center pb-2'>
                Copyright &copy;{year} - Daddy&apos;s Bois | All Rights Reserved
            </div>
        </div>
    );
};

Navbar.propTypes = {
    activeView: PropTypes.string.isRequired,
    setActiveView: PropTypes.func.isRequired,
    setQrCode: PropTypes.func.isRequired,
    setIsModalOpen: PropTypes.func.isRequired
};

export default Navbar;