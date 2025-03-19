import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { getAllOdersAPI } from '../../services/allApi'
import { BASE_URL } from '../../services/baseUrl'
import Header from '../../components/common/Header'
import OrderModal from '../../components/modal/OrderModal';

const OdersPage = () => {
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const seller_category = localStorage.getItem("seller_category");

    useEffect(() => {
        const fetchOders = async () => {
            try {
                const pin = localStorage.getItem("pin"); 
                if (!pin) {
                    console.error("Seller PIN not found");
                    return;
                }
                
                const response = await getAllOdersAPI(pin);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOders();
    }, []); 

    console.log(orders);
    

    // filter table based on table number
   const filterTable = orders.filter((table) => 
    table.table_number.toString().toLowerCase().includes(searchTerm.toLowerCase())
)

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

  return (
   <div className='flex-1 relative z-10 overflow-auto'>
   <Header title={"Orders"} />
        <motion.div
        className="bg-grey-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 w-full mt-9"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
           <div className='bg-gray-700 bg-opacity-50 backdrop-blur-md shadow-lg p-6 rounded-lg'>
                <div className="flex justify-start mb-6">
                <div className="relative ml-8">
                            <input
                                type="text"
                                placeholder="Search table..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                </div>
                <div className="overflow-x-auto">
                    <table  className="min-w-full divide-y divide-gray-700">
                    <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    {seller_category=="Hotel"?"Table":"Room"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
    {filterTable.map((table) => (
        <motion.tr
            key={table.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{table.table_number}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{table.items.map(item => item.food_name).join(", ")}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{Math.max(...(table?.items?.map(item => item.time_taken) || []))} Min</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {table.total_price}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        table.status
                            ? "bg-green-800 text-green-100"
                            : "bg-red-800 text-red-100"
                    }`}
                >
                    {table.status }
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={() => handleViewOrder(table)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    View Details
                </button>
            </td>
        </motion.tr>
    ))}
</tbody>
                    </table>
                </div>
           </div>
        </motion.div>
        <OrderModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            order={selectedOrder}
        />
   </div>
  )
}

export default OdersPage