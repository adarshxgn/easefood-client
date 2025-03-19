    import React from 'react';
    import { motion } from 'framer-motion';
    import { X } from 'lucide-react';

    const OrderModal = ({ isOpen, onClose, order }) => {
        if (!isOpen) return null;

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
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Table Number:</span>
                            <span className="text-white">{order?.table_number}</span>
                        </div>
                        
                        <div className="border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Items:</span>
                            <div className="mt-2 space-y-2">
                                {order?.items?.map((item, index) => (
                                    <div key={index} className="flex flex-col text-white">
                                        <div className="flex justify-around">
                                            <span>{item.food_name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                        </div>

                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Total Time:</span>
                            <span className="text-white">{Math.max(...(order?.items?.map(item => item.time_taken) || []))} Min</span>
                        </div>
                        

                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Total Price:</span>
                            <span className="text-white font-bold">₹{order?.total_price}</span>
                        </div>
                        {order.descriptions  && (
                                            <div className="flex justify-between border-b border-gray-700 pb-2">
                                            <span className="text-gray-400">Note:</span>
                                            <span className="text-white">{order.descriptions}</span>
                                        </div>
                                        )}

                        <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                order?.status === 'Paid' 
                                    ? 'bg-green-800 text-green-100' 
                                    : 'bg-red-800 text-red-100'
                            }`}>
                                {order?.status}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    export default OrderModal;