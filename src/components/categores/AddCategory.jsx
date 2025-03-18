import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addCategoryApi } from "../../services/allApi";
import { addResponceContext } from "../../pages/context/ContextShare";
import { useContext } from "react";

const AddCategory = ({ onClose }) => {
    const[imageFileStatus,setImageFileStatus] = useState(false)
    const [preview,setPreview] = useState('')
    const{addResponce, setAddResponce} =useContext(addResponceContext)
    const [formData, setFormData] = useState({
        category_name: "",
        category_image:"",
    
    });
    useEffect(()=>{
        if(formData.category_image.type=="image/png" || formData.category_image.type=="image/jpg" || formData.category_image.type=="image/jpeg" ){
          setImageFileStatus(true)
          setPreview(URL.createObjectURL(formData.category_image))
        }else{
          setImageFileStatus(false)
          setPreview('')
          setFormData({...formData,category_image:""})
        }
      },[formData.category_image])

 const owner = localStorage.getItem("owner")
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { category_name, category_image, } = formData;
    const owner = localStorage.getItem("owner");

    if (category_name &&  category_image && owner) {
        const addCategory = new FormData();
        addCategory.append("food_category_name", category_name);
        addCategory.append("category_image", category_image);
        addCategory.append("owner", owner);

        const token = localStorage.getItem("accessToken");

        if (token) {
            const reqHeader = {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            };

            try {
                const result = await addCategoryApi(addCategory, reqHeader);
                console.log("API Response:", result);

                if (result.status === 201) {
                    console.log("category added successfully:", result.data);
                    setAddResponce(result);
                    onClose(); 
                } else {
                    console.error("Unexpected Response:", result);
                }
            } catch (err) {
                console.error("API Error:", err.response ? err.response.data : err.message);
            }
        } else {
            console.error("No token found. Please log in.");
        }
    } else {
        console.error("Missing required fields.");
    }
};

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


    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center h-[30rem]"
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
                    <h2 className="text-lg font-bold">Add Dish</h2>
                    <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ✕  
                    </button>
                </div>
                <form className="mt-9" onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Category Name
                        </label>
                        <input
                            type="text"
                            name="category_name"
                            value={formData.category_name}
                            onChange={e=>setFormData({...formData,category_name:e.target.value})}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            required
                        />
                    </div>
        
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Category image
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
                            Add Category
                        </button>
                    </div>
                </form>
                </motion.div>
            </motion.div>
    );
};

export default AddCategory;
    