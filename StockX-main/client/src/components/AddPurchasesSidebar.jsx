import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContextFile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const AddPurchasesSidebar = ({ isOpen, closeSidebar, fetchPurchases, editablePurchase }) => {
    const { store } = useContext(AuthContext);
    const [buyerName, setBuyerName] = useState('');
    const [buyerMobile, setBuyerMobile] = useState('');
    const [items, setItems] = useState([{ uniqueCode: '', quantity: 1, name: '', price: 0 }]);

    const handleRemoveItem = (index) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;

        if (field === 'uniqueCode') {
            fetchItemDetails(index, value);
        }

        setItems(updatedItems);
    };

    const fetchItemDetails = async (index, uniqueCode) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/resource/${uniqueCode}`);
            const updatedItems = [...items];
            updatedItems[index].name = response.data.title;
            updatedItems[index].price = response.data.price;
            setItems(updatedItems);
        } catch (err) {
            console.error("Error:", err);
            toast.error('Item not found');
        }
    };

    const addNewItemField = () => {
        setItems([...items, { uniqueCode: '', quantity: 1, name: '', price: 0 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!buyerName || !buyerMobile || items.length === 0) {
            toast.error('Please fill all required fields.');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/purchase/add`, {
                buyerName,
                buyerMobile,
                items,
                storageStoreEmail: store.email
            });

            toast.success('Purchase added successfully!');
            fetchPurchases();
            closeSidebar();
        } catch (err) {
            console.error('Failed to save purchase:', err);
            toast.error('Failed to save purchase.');
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
                        <h2 className="text-lg font-bold uppercase">{editablePurchase ? 'Edit Purchase' : 'Add Purchase'}</h2>
                        <hr className='border-none h-1 w-full bg-mlsa-sky-blue my-2 mb-6' />
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className='font-bold'>Buyer Name:</label>
                            <input
                                type="text"
                                name="title"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                                required
                                className="w-full px-2 py-1 rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue"
                            />
                        </div>
                        <div>
                            <label className='font-bold'>Buyer Mobile:</label>
                            <input
                                type="text"
                                name="mobile"
                                value={buyerMobile}
                                onChange={(e) => setBuyerMobile(e.target.value)}
                                required
                                className="w-full px-2 py-1 rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue"
                            />
                        </div>
                        <div>
                            <div className='flex items-center justify-between w-full gap-2 pb-2'>
                                <label className='font-bold'>Items bought:</label>
                                <PlusCircleIcon className="size-8 text-mlsa-sky-blue cursor-pointer" onClick={addNewItemField} />
                            </div>
                            {items.map((item, index) => (
                                <div key={index} className='w-full flex items-center justify-center flex-col pb-4'>
                                    <div>
                                        <div className='flex items-center justify-between w-full gap-2'>
                                            <input
                                                type="text"
                                                name="items"
                                                value={item.uniqueCode}
                                                onChange={(e) => handleItemChange(index, 'uniqueCode', e.target.value)}
                                                placeholder='Enter the item codes'
                                                required
                                                className="w-full px-2 py-1 rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue"
                                            />
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                className="w-full rounded-md bg-mlsa-bg border-2 border-mlsa-sky-blue px-2 py-1"
                                                required
                                            />
                                        </div>
                                        <div className='flex items-center justify-between text-sm text-mlsa-sky-blue font-semibold italic py-1'>
                                            <p>{item.name}</p>
                                            <p>&#8377; {item.price}</p>
                                        </div>
                                    </div>
                                    {items.length > 1 &&
                                        <button onClick={() => handleRemoveItem(index)} className='w-full bg-transparent border-2 border-red-900 rounded-md flex items-center justify-center gap-2 px-2 py-1 cursor-pointer transition duration-150 ease-in-out hover:bg-red-900'>
                                            Remove this item
                                            <XCircleIcon className="size-8 text-mlsa-sky-blue cursor-pointer" />
                                        </button>
                                    }
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="bg-mlsa-sky-blue text-black font-bold px-4 py-2 rounded-md transition duration-100 ease-in-out hover:bg-[#2b8484] hover:text-white">
                            Add Purchase
                        </button>
                    </form>
                </div>
            </div >
        </>
    );
};

AddPurchasesSidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeSidebar: PropTypes.func.isRequired,
    fetchPurchases: PropTypes.func.isRequired,
    editablePurchase: PropTypes.object,
};

export default AddPurchasesSidebar;