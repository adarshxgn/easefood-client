import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {  editCategoryApi } from "../../services/allApi";
import { editResponceContext } from "../../pages/context/ContextShare";
import { useContext } from "react"; 
import { BASE_URL } from "../../services/baseUrl";

const EditCategories = ({ onClose, category }) => {
    const [imageFileStatus, setImageFileStatus] = useState(false);
    const [preview, setPreview] = useState('');
    const {editResponce,setEditResponce } = useContext(editResponceContext);
    const [formData, setFormData] = useState({
        categoryId: category?.id,
        category_name: category?.food_category_name,
        category_image: category?.category_image,
    });

 

    useEffect(() => {
        if (category) {
            setFormData({
                categoryId: category?.id || "",
                category_name: category?.food_category_name || "", // ✅ Use the correct key
                category_image: category?.category_image || "",
            });
    
            if (category.category_image && typeof category.category_image === "string") {
                setPreview(`${BASE_URL}${category.category_image}`);
    
                fetch(`${BASE_URL}${category.category_image}`)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const file = new File([blob], "image.jpg", { type: blob.type });
                        setFormData((prev) => ({ ...prev, category_image: file }));
                        setImageFileStatus(true);
                    })
                    .catch((err) => console.error("Error fetching image:", err));
            }
        }
    }, [category]);
    
   



    const owner = localStorage.getItem("owner");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, category_image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { categoryId, category_name, category_image} = formData;
        if (category_name && category_image ) {
            const editCategory = new FormData();
            editCategory.append('categoryId', categoryId);
            editCategory.append('food_category_name', category_name);
            editCategory.append('category_image', category_image); 
            editCategory.append('owner', owner); // Always append the image file here
            const token = localStorage.getItem("accessToken");
            if (token) {
                const reqHeader = {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                };
                try {
                    const result = await editCategoryApi(categoryId, editCategory, reqHeader);
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
                            category Name
                        </label>
                        <input
                            type="text"
                            name="food_category_name"
                            value={formData.category_name}
                            onChange={e => setFormData({ ...formData, category_name: e.target.value })}
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
                            Edit Category
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditCategories;