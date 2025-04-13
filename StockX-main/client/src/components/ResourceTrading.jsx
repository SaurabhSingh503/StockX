import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AddResourceSidebar from './AddResourceSidebar';
import ResourceTradingModal from './ResourceTradingModal';
import { MagnifyingGlassCircleIcon, PencilIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../contexts/AuthContextFile';

const ResourceTrading = () => {
    const { store } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [editableResource, setEditableResource] = useState(null);
    const storageStoreEmail = localStorage.getItem("storeEmail");

    // Fetch all resources from the server
    const fetchResources = async () => {
        try {
            const storageStoreEmail = localStorage.getItem('storeEmail');
            const response = await axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/resource/all`);

            // Filter purchases based on storeEmail
            const responseData = response.data.filter(resource => resource.storeEmail === storageStoreEmail);

            setResources(responseData || []);
            setFilteredResources(responseData || []);
        } catch (err) {
            console.error('Failed to fetch resources:', err);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Handle search input and filter resources
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = resources.filter((resource) =>
            resource.title.toLowerCase().includes(query) ||
            resource.uniqueCode?.toString().includes(query)
        );

        setFilteredResources(filtered);
    };

    // Handle opening the modal for viewing resource details
    const handleViewResource = (resource) => {
        setSelectedResource(resource);
        setModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalOpen(false);
        setSelectedResource(null);
    };

    // Handle opening the sidebar for editing a resource
    const handleEditResource = (resource) => {
        if (storageStoreEmail === resource.storeEmail) {
            setEditableResource(resource);
            setSidebarOpen(true);
        } else {
            alert('You are not authorized to edit this resource.');
        }
    };

    // Close the sidebar and clear editable resource
    const closeSidebar = () => {
        setSidebarOpen(false);
        setEditableResource(null);
    };

    return (
        <div className="w-[70%] h-[80%] border-2 border-mlsa-sky-blue rounded-md px-5 pb-2 overflow-hidden overflow-y-auto">
            <div className='sticky top-0 w-full bg-mlsa-bg pb-1'>
                <div className="font-bold flex items-center justify-between py-3">
                    <div className="text-white text-lg">Resource Trading</div>
                    <div className="w-96 h-8 rounded-md flex items-center justify-start border-2 border-mlsa-sky-blue px-1 py-4">
                        <MagnifyingGlassCircleIcon className="h-7 w-7 text-mlsa-sky-blue mr-2" />
                        <input
                            type="text"
                            placeholder="Search Resource, Product ID"
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
                        Add a Resource
                    </button>
                </div>
                <hr className="border-none h-1 bg-mlsa-sky-blue mb-4" />
            </div>
            <div className="overflow-hidden overflow-y-auto w-full">
                {Array.isArray(filteredResources) && filteredResources.map((resource) => (
                    <div
                        key={resource._id}
                        className="w-full border-2 border-mlsa-sky-blue flex items-center justify-between px-2 py-2 rounded-md mb-2"
                    >
                        <div>
                            <img
                                src={resource.img}
                                alt={resource.title}
                                className="size-16 rounded-full"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-center items-center gap-3 text-white">
                                <div className="font-bold text-lg">{resource.title}</div>
                            </div>
                            <div className="flex justify-center items-center gap-3 text-white">
                                <div>
                                    Quantity: <span className="text-mlsa-sky-blue font-semibold">{resource.quantity}</span>
                                </div>
                                |
                                <div>
                                    Price: <span className="text-mlsa-sky-blue font-semibold"> &#8377; {resource.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-5">
                            {storageStoreEmail === resource.storeEmail && (
                                <PencilIcon
                                    className="h-10 w-10 p-2 text-mlsa-bg rounded-full bg-mlsa-sky-blue cursor-pointer"
                                    onClick={() => handleEditResource(resource)}
                                />
                            )}
                            <button
                                onClick={() => handleViewResource(resource)}
                                className="bg-mlsa-sky-blue rounded-md px-5 py-2 font-semibold"
                            >
                                View Resource
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedResource && (
                <ResourceTradingModal resource={selectedResource} store={store} closeModal={closeModal} />
            )}

            <AddResourceSidebar
                isOpen={isSidebarOpen}
                closeSidebar={closeSidebar}
                fetchResources={fetchResources}
                editableResource={editableResource}
            />
        </div>
    );
};

export default ResourceTrading;