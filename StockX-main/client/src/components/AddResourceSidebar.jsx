import { useEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContextFile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddResourceSidebar = ({ isOpen, closeSidebar, fetchResources, editableResource }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { store } = useContext(AuthContext);
    const [imageUrl, setImageUrl] = useState('');
    const [resource, setResource] = useState({
        title: '',
        description: '',
        price: '',
        quantity: 1,
    });

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    // Reset resource state when transitioning between add and edit modes
    useEffect(() => {
        if (editableResource) {
            setResource({
                ...editableResource,
                price: editableResource.price || '',
            });
            setImageUrl(editableResource.img);
        } else {
            setResource({
                title: '',
                description: '',
                price: '',
                quantity: 1,
            });
            setImageUrl('');
        }
    }, [editableResource, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResource({ ...resource, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl || !resource.title || !resource.quantity || !resource.price) {
            toast.error('Please fill all required fields and upload an image.');
            return;
        }

        const newResource = {
            ...resource,
            img: imageUrl,
            storeEmail: store.email
        };

        try {
            let response;
            if (editableResource) {
                // Update existing resource
                response = await axios.put(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/resource/${editableResource._id}`, newResource);
                toast.success('Resource updated successfully!');
            } else {
                // Add new resource
                response = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/resource/add`, newResource);
                toast.success('Resource added successfully!');
            }
            const addedResource = response.data;
            console.log('Resource Added:', addedResource);

            fetchResources();
            closeSidebar();
        } catch (err) {
            console.error('Failed to save resource:', err);
            toast.error('Failed to save resource.');
        }
    };

    const handleDelete = async () => {
        if (!editableResource || !editableResource._id) {
            toast.error('Failed to delete resource: Missing resource ID.');
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this resource?');
        if (!confirmDelete) return;

        try {
            const deleteUrl = `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/resource/${editableResource._id}`;
            console.log('DELETE Request URL:', deleteUrl);

            await axios.delete(deleteUrl);
            toast.success('Resource deleted successfully!');
            fetchResources();
            closeSidebar();
        } catch (err) {
            console.error('Failed to delete resource:', err);
            toast.error('Failed to delete resource. Please try again.');
        }
    };


    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/cloudinary-signature`);

            formData.append('file', file);
            formData.append('upload_preset', 'cn-hackathon');
            formData.append('timestamp', data.timestamp);
            formData.append('signature', data.signature);
            formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

            const response = await axios.post('https://api.cloudinary.com/v1_1/sambit-mondal/image/upload', formData);
            setImageUrl(response.data.secure_url);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('Failed to upload image. Please check your Cloudinary configuration.');
        }
    };

    return (
        <>
            <ToastContainer
                position='top-right'
            />
            {isOpen ?
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition ease-in-out duration-200"></div>
                : ''
            }
            <div
                className={`fixed top-0 right-0 w-[30%] h-full bg-mlsa-bg border-l-2 border-mlsa-sky-blue text-white z-50 shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } transition-transform duration-300 ease-in-out overflow-hidden overflow-y-auto`}
            >
                <div className="p-5">
                    <button onClick={closeSidebar} className="text-red-500 font-bold absolute right-4 top-4 border-2 border-red-500 rounded-full w-8 h-8">X</button>
                    <div className='w-full flex flex-col'>
                        <h2 className="text-lg font-bold uppercase">{editableResource ? 'Edit Resource' : 'Add Resource'}</h2>
                        <hr className='border-none h-1 w-full bg-mlsa-sky-blue my-2 mb-6' />
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className='font-bold'>Upload Image:</label>
                            <input type="file" onChange={handleUploadImage} className="mt-2" />
                        </div>
                        <div>
                            <label className='font-bold'>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={resource.title}
                                onChange={handleChange}
                                required
                                className="w-full px-2 py-1 rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue"
                            />
                        </div>
                        <div>
                            <label className='font-bold'>Description (optional):</label>
                            <textarea
                                name="description"
                                value={resource.description}
                                onChange={handleChange}
                                className="w-full px-2 py-1 rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue"
                            />
                        </div>
                        <div>
                            <label className='font-bold'>Price:</label>
                            <div className='flex items-center justify-center gap-3'>
                                <input
                                    type="number"
                                    name="price"
                                    value={resource.price}
                                    onChange={handleChange}
                                    className="w-full rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue px-2 py-1"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className='font-bold'>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={resource.quantity}
                                onChange={handleChange}
                                className="w-full rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue px-2 py-1"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-mlsa-sky-blue text-black font-bold px-4 py-2 rounded-md transition duration-100 ease-in-out hover:bg-[#2b8484] hover:text-white">
                            {editableResource ? 'Update ' : 'Add '} Resource
                        </button>
                        {editableResource && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="border-2 border-mlsa-sky-blue text-white font-bold px-4 py-2 rounded-md mt-2 transition duration-100 ease-in-out hover:bg-red-800"
                            >
                                Delete Resource
                            </button>
                        )}
                    </form>
                </div>
            </div >
        </>
    );
};

AddResourceSidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    fetchResources: PropTypes.func.isRequired,
    editableResource: PropTypes.object,
};

export default AddResourceSidebar;