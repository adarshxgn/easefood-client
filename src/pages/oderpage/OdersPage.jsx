import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { getAllOdersAPI } from '../../services/allApi'
import { BASE_URL } from '../../services/baseUrl'
import Header from '../../components/common/Header'
const OdersPage = () => {
    const [tablenumber, setTablenumber] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
            // Fetch food list from API on component mount
            const fetchOders = async () => {
                try {
                    const response = await getAllOdersAPI();
                    setTablenumber(response.data); // Assuming the API response contains the table number  
                } catch (error) {
                    console.error("Error fetching table:", error);
                }
            };
    
            fetchOders();
        }, []); 

    // filter table based on table number
    // const filterTable = tablenumber.filter((table) => {
    //     table.table_number.toLowerCase().includes(searchTerm.toLowerCase())
    // })
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
                                        Table
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
                            <motion.tr
                                    // key={table.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                   
                                   <td className="px-6 py-4 whitespace-nowrap">
                                        {/* <div className="text-sm text-gray-300">{table.table_number}</div> */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* <div className="text-sm text-gray-300">{table.food_category_obj}</div> */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* <div className="text-sm text-gray-300">{table.time_taken} Min</div> */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                                            {/* {table.price} */}
                                        </span>
                                    </td>
    
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                table.is_available
                                                    ? "bg-green-800 text-green-100"
                                                    : "bg-red-800 text-red-100"
                                            }`}
                                        >
                                            {table.is_available ? "Delivered" : "Pending"}
                                        </span> */}
                                    </td>
    
                                    {/* <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <button
                                            onClick={() => handleEdit(table.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(table.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td> */}
                                </motion.tr>                            
                            </tbody>
                    </table>
                </div>
           </div>
        </motion.div>
   </div>
  )
}

export default OdersPage