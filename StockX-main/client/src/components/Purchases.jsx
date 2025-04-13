import { MagnifyingGlassCircleIcon, PlusCircleIcon, QrCodeIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import AddPurchasesSidebar from "./AddPurchasesSidebar";
import axios from "axios";

const Purchases = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [editablePurchase, setEditablePurchase] = useState(null);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchPurchases = async () => {
        try {
            const storageStoreEmail = localStorage.getItem('storeEmail');
            const response = await axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/purchase/all`);

            // Filter purchases based on storeEmail
            const filteredData = response.data.filter(purchase => purchase.storageStoreEmail === storageStoreEmail);

            setPurchases(filteredData);
            setFilteredPurchases(filteredData);
        } catch (err) {
            console.error('Failed to fetch purchases:', err);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = purchases.filter((purchase) =>
            purchase.buyerName.toLowerCase().includes(query) ||
            purchase.purchaseID?.toString().includes(query)
        );

        setFilteredPurchases(filtered);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setEditablePurchase(null);
    };

    const handlePurchaseClick = (purchase) => {
        setSelectedPurchase(purchase);
        setModalOpen(true);
    };

    return (
        <div className="w-[70%] h-[80%] border-2 border-mlsa-sky-blue rounded-md px-5 pb-2 overflow-hidden overflow-y-auto">
            <div className='sticky top-0 w-full bg-mlsa-bg pb-1'>
                <div className="font-bold flex items-center justify-between w-full py-3">
                    <div className="text-white text-lg">Purchases</div>
                    <div className="w-96 h-8 rounded-md flex items-center justify-start border-2 border-mlsa-sky-blue px-1 py-4">
                        <MagnifyingGlassCircleIcon className="h-7 w-7 text-mlsa-sky-blue mr-2" />
                        <input
                            type="text"
                            placeholder="Search Purchase, Purchase ID"
                            className="w-full bg-mlsa-bg text-white font-normal text-sm outline-none"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="bg-mlsa-sky-blue rounded-full px-5 py-2 text-black flex items-center justify-center gap-2 transition duration-100 ease-in-out hover:bg-[#2b8484] hover:text-white"
                    >
                        <PlusCircleIcon className="h-6 w-6" />
                        Add a Purchase
                    </button>
                </div>
                <hr className="border-none h-1 bg-mlsa-sky-blue mb-4" />
            </div>
            <div className="overflow-hidden overflow-y-auto w-full">
                {Array.isArray(filteredPurchases) && filteredPurchases.map((purchase) => (
                    <div
                        key={purchase._id}
                        className="w-full border-2 border-mlsa-sky-blue flex items-center justify-between px-7 py-2 rounded-md mb-2 cursor-pointer hover:bg-gray-700"
                        onClick={() => handlePurchaseClick(purchase)}
                    >
                        <div className="flex items-start justify-center flex-col">
                            <div className="text-mlsa-sky-blue font-bold">
                                {purchase.buyerName}
                            </div>
                            <div className="text-white italic">
                                &#8377; {purchase.totalAmount}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-center items-center gap-3 text-white">
                                <div className="font-bold text-lg">{purchase.title}</div>
                                <div className="font-normal text-sm">
                                    <QrCodeIcon className="size-6 text-mlsa-sky-blue mr-1 cursor-pointer" />
                                </div>
                            </div>
                            <div className="flex justify-center items-center gap-3 text-white">
                                <div className="font-semibold">
                                    Purchase ID: <span className="text-mlsa-sky-blue font-semibold italic">{purchase.purchaseID}</span>
                                </div>
                                |
                                <div>
                                    Date: <span className="text-mlsa-sky-blue font-semibold"> {purchase.createdAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddPurchasesSidebar
                isOpen={isSidebarOpen}
                closeSidebar={closeSidebar}
                fetchPurchases={fetchPurchases}
                editablePurchase={editablePurchase}
            />

            {isModalOpen && selectedPurchase && (
                <PurchaseDetailsModal purchase={selectedPurchase} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
}

import PropTypes from 'prop-types';

const PurchaseDetailsModal = ({ purchase, onClose }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-mlsa-bg text-white p-5 rounded-lg w-[50%] flex items-center justify-center flex-col">
                    <div className="w-3/4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Purchase Details</h2>
                            <hr className="border-none h-1 bg-mlsa-sky-blue my-2" />

                            <p><strong>Buyer Name:</strong> {purchase.buyerName}</p>
                            <p><strong>Buyer Mobile:</strong> {purchase.buyerMobile}</p>
                            <p><strong>Purchase ID:</strong> {purchase.purchaseID}</p>
                            <p><strong>Total Amount:</strong> &#8377; {purchase.totalAmount}</p>
                            <p><strong>Date:</strong> {purchase.createdAt}</p>

                            <h3 className="text-lg font-bold mt-4">Items Bought:</h3>
                            <ul className="list-disc list-inside">
                                {purchase.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity} x &#8377;{item.price}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* QR Code Section */}
                        {purchase.qrCode && (
                            <div className="w-32 h-32 flex justify-end">
                                <img
                                    src={`data:image/png;base64;${purchase.qrCode}`}
                                    alt="QR Code for the purchase"
                                    className="w-32 h-32 rounded-md"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end w-full mt-4">
                        <button
                            onClick={onClose}
                            className="bg-red-500 px-4 w-full py-2 rounded-md text-black font-bold transition duration-100 ease-in-out hover:bg-red-700 hover:text-white"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

PurchaseDetailsModal.propTypes = {
    purchase: PropTypes.shape({
        buyerName: PropTypes.string.isRequired,
        buyerMobile: PropTypes.string.isRequired,
        purchaseID: PropTypes.string.isRequired,
        totalAmount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
        })).isRequired,
        qrCode: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default Purchases;