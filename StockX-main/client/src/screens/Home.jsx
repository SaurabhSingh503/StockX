import { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import ResourceTrading from '../components/ResourceTrading';
import { AuthContext } from '../contexts/AuthContextFile';
import QrModal from '../components/QrModal';
import Dashboard from '../components/Dashboard';
import Purchases from '../components/Purchases';
import Chatbot from '../components/Chatbot';

const Home = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { store } = useContext(AuthContext);

    // QR Modal state moved here
    const [qrCode, setQrCode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Show loading screen while fetching store details
    if (!store) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <h1 className="text-white text-lg">Loading...</h1>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-screen bg-mlsa-bg flex items-center justify-between px-5">
                <Navbar
                    setActiveView={setActiveView}
                    activeView={activeView}
                    setQrCode={setQrCode} // Pass down state
                    setIsModalOpen={setIsModalOpen}
                />
                {activeView === 'resourceTrading' ? <ResourceTrading />
                    : activeView === 'dashboard' ? <Dashboard />
                        : activeView === 'purchases' ? <Purchases />
                            : null
                }

                {/* QR Modal outside Navbar, inside Home */}
                <QrModal qrCode={qrCode} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>
            <Chatbot />
        </>
    );
};

export default Home;