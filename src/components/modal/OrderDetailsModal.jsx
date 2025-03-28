import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { changestatusapi } from '../../services/allApi';
import { useContext } from 'react';
import { orderContext } from '../../pages/context/ContextShare';

const OrderDetailsModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const seller_category = localStorage.getItem("seller_category");
    const { setOrderUpdate } = useContext(orderContext);
    const handleStatusChange = async () => {
        try {
            setIsUpdating(true);
            const response = await changestatusapi(order.id, "Delivered");
            if (response.status === 200) {
                // Call the callback to update the parent component
                onStatusUpdate && onStatusUpdate();
                setOrderUpdate(prev => !prev);
                onClose();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !order) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Order Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-700 pb-4">
                        <div>
                            <p className="text-gray-400">{seller_category=="Hotel"?"Table":"Room"} Number</p>
                            <p className="text-white text-lg">{order.table_number}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Order Time</p>
                            <p className="text-white">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="border-b border-gray-700 pb-4">
                        <h3 className="text-white font-semibold mb-2">Items</h3>
                        <div className="space-y-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-300">{item.food_name}</span>
                                    <span className="text-gray-400">₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.descriptions && (
                        <div className="border-b border-gray-700 pb-4">
                            <h3 className="text-white font-semibold mb-2">Special Instructions</h3>
                            <p className="text-gray-300">{order.descriptions}</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="text-white font-bold text-xl">₹{order.total_price}</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                    
                    {order.status !== "Delivered" && (
                        <button
                            onClick={handleStatusChange}
                            disabled={isUpdating}
                            className={`px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 
                                ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'} 
                                transition-colors`}
                        >
                            <Check size={16} />
                            {isUpdating ? 'Updating...' : 'Mark as Delivered'}
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OrderDetailsModal;