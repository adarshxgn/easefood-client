import React, { useState, useEffect } from "react";
import { motion } from "motion/react"
import StatCard from "../../components/common/StatCard";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import Header from "../../components/common/Header";
import { getAllOdersAPI, getOrderDashboardAPI } from "../../services/allApi";
import OrderDetailsModal from '../../components/modal/OrderDetailsModal';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [dashOrders, setDashOrders] = useState([]);
    const seller_category = localStorage.getItem("seller_category");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
    });
    const fetchallOders = async () => {
                try {
                    const pin = localStorage.getItem("pin"); 
                    if (!pin) {
                        console.error("Seller PIN not found");
                        return;
                    }
                    
                    const response = await getAllOdersAPI(pin);
                    if (response && response.data) {
                        setOrders(response.data);
                
                        // Calculate stats safely with updated logic
                        const total = response.data.length || 0;
                        const completed = response.data.filter(order => order?.status === "Delivered").length || 0;
                        const pending = response.data.filter(order => order?.status === "Pending").length || 0;
        
                        // Fixed revenue calculation
                        const revenue = response.data.reduce((sum, order) => {
                            if (order?.items) {
                                const orderTotal = order.items.reduce((itemSum, item) => {
                                    return itemSum + (item.price * (item.quantity || 1));
                                }, 0);
                                return sum + orderTotal;
                            }
                            return sum;
                        }, 0);
                        
                        setOrderStats({
                            totalOrders: total,
                            pendingOrders: pending,
                            completedOrders: completed,
                            totalRevenue: `₹${revenue.toFixed(2)}`,
                        });
                    }
                    
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            };

    const fetchOrders = async () => {
        try {
            const pin = localStorage.getItem("pin");
            if (!pin) {
                console.error("No PIN found in localStorage");
                return;
            }

            const response = await getOrderDashboardAPI(pin);
            setDashOrders(response.data);
            
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]); // Set empty array on error
        }
    };

    useEffect(() => {
        fetchOrders(), fetchallOders();
    }, []);

    const handleStatusUpdate = async () => {
        await fetchOrders(); // Now we can access fetchOrders here
    };

    // Add safe check before mapping orders
    const renderOrders = () => {
        if (!dashOrders || dashOrders.length === 0) {
            return (
                <div className="col-span-full text-center text-gray-400 py-8">
                    No orders found
                </div>
            );
        }

        return dashOrders.map((order) => (
            <motion.div
                key={order.id}
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
                onClick={() => {
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">
                        {seller_category=="Hotel"?"Table":"Room"} {order.table_number}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                        order.status === 'Delivered' 
                            ? 'bg-green-600' 
                            : 'bg-yellow-600'
                    }`}>
                        {order.status}
                    </span>
                </div>
                <p className="text-gray-400">Items: {order.items.length}</p>
                <p className="text-gray-400">Total: ₹{order.total_price}</p>
                <p className="text-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleString()}
                </p>
            </motion.div>
        ));
    };

    return (
        <div className='flex-1 relative z-10 overflow-auto'>
            <Header title={"Dashboard"} />
            
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
                    <StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
                    <StatCard name='Completed Orders' icon={CheckCircle} value={orderStats.completedOrders} color='#10B981' />
                    <StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
                </motion.div>

                {/* Orders Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {renderOrders()}
                </motion.div>
            </main>

            {isModalOpen && selectedOrder && (
                <OrderDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    order={selectedOrder}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default Dashboard;
