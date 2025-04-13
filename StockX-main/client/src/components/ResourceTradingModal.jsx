import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ResourceTradingModal = ({ resource, closeModal }) => {
    const ref = useRef();

    useEffect(() => {
        if (!resource) return;

        // Handle click outside to close the modal
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [resource, closeModal]);

    if (!resource) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 transition ease-in-out duration-200">
            <div ref={ref} className="relative bg-black text-white border-2 border-mlsa-sky-blue shadow-md rounded-lg w-[50%] h-[30rem] p-5">
                <div className='h-[90%] flex items-center justify-around'>
                    <XMarkIcon
                        className="absolute top-4 right-4 w-8 h-8 cursor-pointer text-mlsa-sky-blue transition hover:scale-110"
                        onClick={closeModal}
                    />
                    <div className="flex flex-col items-center justify-center h-[80%] w-[50%] gap-4">
                        <img
                            src={resource.img || '/Demo_Image.png'}
                            alt={resource.title}
                            className="w-full h-40 rounded-md border-2 border-mlsa-sky-blue object-cover"
                        />
                        <h2 className="text-xl font-bold">{resource.title}</h2>
                        <p className="text-sm italic text-gray-400">Product ID: {resource.uniqueCode}</p>
                        <p className="text-sm text-mlsa-sky-blue"> {resource.description}</p>
                        <p>Price: <span className="font-bold">&#8377; {resource.price}</span></p>
                        <p>Quantity: <span className="font-bold">{resource.quantity}</span></p>
                    </div>

                    {/* Display QR Code */}
                    <div className="flex flex-col items-center justify-center w-[45%]">
                        <h3 className="text-lg font-semibold">QR Code</h3>
                        {resource.qrCode ? (
                            <img
                                src={`data:image/png;base64;${resource.qrCode}`}
                                alt="QR Code"
                                className="w-40 h-40 border-2 border-mlsa-sky-blue rounded-md"
                            />
                        ) : (
                            <p className="text-gray-400">QR Code not available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ResourceTradingModal.propTypes = {
    resource: PropTypes.shape({
        storeEmail: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        img: PropTypes.string,
        uniqueCode: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        inReturn: PropTypes.string.isRequired,
        qrCode: PropTypes.string,  // Added QR code prop
    }).isRequired,
    closeModal: PropTypes.func.isRequired,
};

export default ResourceTradingModal;