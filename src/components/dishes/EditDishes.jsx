import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addFoodListApi, editFoodListApi } from "../../services/allApi";
import { editResponceContext } from "../../pages/context/ContextShare";
import { useContext } from "react"; 
import { BASE_URL } from "../../services/baseUrl";

const EditDishes = ({ onClose, dish }) => {
    const [imageFileStatus, setImageFileStatus] = useState(false);
    const [preview, setPreview] = useState('');
    const { editResponce, setEditResponce } = useContext(editResponceContext);
    const [formData, setFormData] = useState({
        foodId: dish?.id,
        food_name: dish?.food_name,
        description: dish?.description,
        food_category_name: dish?.food_category_name,
        price: dish?.price,
        food_image: dish?.food_image,
        time_taken: dish?.time_taken,
        is_available: dish?.is_available
    });

    useEffect(() => {
        const fetchImage = async () => {
            if (dish?.food_image && typeof dish.food_image === 'string') {
                setPreview(`${BASE_URL}${dish.food_image}`);
                try {
                    const response = await fetch(`${BASE_URL}${dish.food_image}`);
                    const blob = await response.blob();
                    const file = new File([blob], "image.jpg", { type: blob.type });
                    
                    setFormData(prevState => ({
                        ...prevState,
                        food_image: file
                    }));
    
                    setImageFileStatus(true);
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }
        };
    
        fetchImage();
    }, [dish]);
    

    const owner = localStorage.getItem("owner");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, food_image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { foodId, food_name, description, food_category_name, price, food_image, time_taken, is_available } = formData;
        if (food_name && description && food_category_name && price && food_image && time_taken && is_available) {
            const editDish = new FormData();
            editDish.append('foodId', foodId);
            editDish.append('food_name', food_name);
            editDish.append('description', description);
            editDish.append('food_category_name', food_category_name);
            editDish.append('price', price);
            editDish.append('food_image', food_image);  // Always append the image file here
            editDish.append('time_taken', time_taken);
            editDish.append('is_available', is_available);
            editDish.append('owner', owner);

            const token = localStorage.getItem("accessToken");
            if (token) {
                const reqHeader = {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                };
                try {
                    const result = await editFoodListApi(foodId, editDish, reqHeader);
                    console.log(result);
                    if (result.status === 200) {
                        onClose();
                        setEditResponce(result);
                    } else {
                        alert(result.response.data);
                    }
                } catch (err) {
                    console.log(err.response);
                }
            }
        }
        onClose(); // Close the modal after submission
    };

    return (
        <motion.div
            className="fixed inset-0  flex items-center justify-center h-[40rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-lg shadow-lg p-6 w-96"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Edit Dish</h2>
                    <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Dish Name
                        </label>
                        <input
                            type="text"
                            name="food_name"
                            value={formData.food_name}
                            onChange={e => setFormData({ ...formData, food_name: e.target.value })}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.food_category_name}
                            onChange={e => setFormData({ ...formData, food_category_name: e.target.value })}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Food image
                        </label>
                        <div className="text-center">
                            {preview ? (
                                <img src={preview} alt="Preview" className="max-h-40 mx-auto" />
                            ) : (
                                <p>No image chosen</p>
                            )}
                            <button
                                type="button"
                                onClick={() => document.getElementById('image-input').click()}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Upload Image
                            </button>
                            <input
                                type="file"
                                id="image-input"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Time taken
                        </label>
                        <input
                            type="number"
                            name="time_taken"
                            value={formData.time_taken}
                            onChange={e => setFormData({ ...formData, time_taken: e.target.value })}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            required
                        />
                    </div>
                    <div className="mt-4 flex gap-3 items-center">
                        <label className="block text-sm font-medium text-gray-700 mr-4">
                            Available
                        </label>
                        <input
                            type="radio"
                            name="is_available"
                            value="available"
                            checked={formData.is_available === "available"}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.value })}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-gray-900"
                        />
                        <label className="block text-sm font-medium text-gray-700 mr-4">
                            Unavailable
                        </label>
                        <input
                            type="radio"
                            name="is_available"
                            value="unavailable"
                            checked={formData.is_available === "unavailable"}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.value })}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-gray-900"
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Edit Dish
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditDishes;