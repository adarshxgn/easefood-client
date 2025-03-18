import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import AddDishes from "./AddDishes";
import { deleteFoodListApi, getFoodListApi } from "../../services/allApi";
import { BASE_URL } from "../../services/baseUrl";
import { addResponceContext,editResponceContext } from "../../pages/context/ContextShare";
import EditDishes from "./EditDishes";

const DishesTable = () => {
    const { addResponce, setAddResponce } = useContext(addResponceContext);
    const { editResponce, setEditResponce } = useContext(editResponceContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dishes, setDishes] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selectedDish, setSelectedDish] = useState(null); 
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDish(null); 
    };
    const fetchFoodList = async () => {
        try {
            const response = await getFoodListApi();
            setDishes(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    useEffect(() => {
        fetchFoodList();
    }, [addResponce,editResponce]); 


    const filteredDishes = dishes.filter((dish) =>
        dish.food_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleDelete = async (foodId) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const reqHeader = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
            try {
                const result = await deleteFoodListApi(foodId, reqHeader);
                console.log(result);
                if (result.status == 204) {
                    fetchFoodList();
                } else {
                    console.log(result);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleEdit = (dish) => {
        setSelectedDish(dish); 
        openModal(); 
    }
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-start items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Dishes</h2>
                <div className="z-10">  
                    <button
                        className="text-lg rounded-lg bg-blue-700 hover:bg-blue-800 text-blue-100 m-5 p-1"
                        onClick={openModal}
                    >
                        Add Dish
                    </button>

                    {isModalOpen && !selectedDish && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <AddDishes onClose={closeModal} />
                        </div>
                    )}
                </div>
                <div className="relative ml-auto">
                    <input
                        type="text"
                        placeholder="Search Dishes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Dish
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Category
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
                        {filteredDishes.map((dish) => (
                            <motion.tr
                                key={dish.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <img
                                                src={`${BASE_URL}${dish.food_image}`}
                                                className="h-full w-full rounded-lg object-cover"
                                                alt={dish.food_name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-100">
                                                {dish.food_name}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{dish.food_category_name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{dish.time_taken} Min</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                                        {dish.price}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            dish.is_available==="available"
                                                ? "bg-green-800 text-green-100"
                                                : "bg-red-800 text-red-100"
                                        }`
                                    }
                                    >
                                        {dish.is_available==="available"  ? "Available" : "Unavailable"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap space-x-2 flex">
                                   <div>
                                        <button
                                            onClick={() => handleEdit(dish)} 
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                   </div>
                                    <div>
                                        <button
                                            onClick={() => handleDelete(dish.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedDish && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <EditDishes dish={selectedDish} onClose={closeModal} />
                </div>
            )}
        </motion.div>
    );
};

export default DishesTable;
