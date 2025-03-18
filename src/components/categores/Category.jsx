import { motion } from 'motion/react'
import React, { useContext, useEffect, useState } from 'react'
import { getCategoryApi } from '../../services/allApi'
import { BASE_URL } from '../../services/baseUrl'
import AddCategory from './AddCategory'
import EditCategories from './EditCategories'
import { deleteCategoryApi } from '../../services/allApi'
import { addResponceContext, editResponceContext } from "../../pages/context/ContextShare";


const Category = () => {
  const { addResponce, setAddResponce } = useContext(addResponceContext);
  const { editResponce, setEditResponce } = useContext(editResponceContext);
  const [viewCatergory, setViewCategory] = useState([])

  const [addCategory, setAddCategory] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setAddCategory(null);
  };


  const fetchCategory = async () => {
    try {
      const response = await getCategoryApi();
      setViewCategory(response.data)
      console.log(response.data);
    }
    catch (err) {
      console.log("error fetching category", err);
    }
  }
  useEffect(() => {
    fetchCategory();
  }, [addResponce, editResponce])

  const handleDelete = async (categoryId) => {
    console.log("Deleting category with ID:", categoryId);  
    const token = localStorage.getItem("accessToken");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      try {
        const result = await deleteCategoryApi(categoryId, reqHeader);
        console.log(result);
        if (result.status === 204) {
          fetchCategory(); // Refresh category list after deletion
        } else {
          console.log(result);
        }
      } catch (err) {
        console.log("Error deleting category:", err);
      }
    }
  };

  const handleEdit = (category) => {
    console.log("Editing category:", category); // Debugging
    setAddCategory(category);
    openModal();
  }
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="overflow-x-auto">
        <button
          className="text-lg rounded-lg bg-blue-700 hover:bg-blue-800 text-blue-100 m-5 p-1"
          onClick={openModal}
        >
          Add Category
        </button>

        {isModalOpen && !addCategory && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <AddCategory onClose={closeModal} />
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {viewCatergory.map((category) => (


              <motion.tr
              key={category.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-20 w-20">
                      <img
                        src={`${BASE_URL}${category.category_image}`}
                        className="h-full w-full rounded-lg object-cover"
                        alt=''
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {category.food_category_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2 flex">
                  <div>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-500 hover:text-blue-700" >
                      Edit
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(category.id)}

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
      {isModalOpen && addCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditCategories category={addCategory} onClose={closeModal} />
        </div>
      )}

    </motion.div>
  )
}

export default Category