import { motion } from 'motion/react'
import React, { useContext, useState } from 'react'
import { addTableApi } from '../../services/allApi'
import { tableaddResponceContext } from '../../pages/context/ContextShare'

const Addtables = ({onClose}) => {
    const {tableaddResponce, setTableAddResponce} = useContext(tableaddResponceContext)
    const [formdata, setFormdata] = useState({
        table_number: "",
        owner: ""
    })
const owner = localStorage.getItem("owner")
    const handleSubmit = async(e)=>{
        e.preventDefault()
        const{table_number} =formdata
        if(table_number){
            const addTable = new FormData()
            addTable.append('table_number',table_number)
            addTable.append('owner',owner)

            const token = localStorage.getItem("accessToken")   
                        if(token){
                            const reqHeader = {
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                            }
                            try{
                                const result = await addTableApi(addTable,reqHeader)
                                console.log(result);
                                if(result.status==201){
                                    onClose()
                                    setTableAddResponce(result.data)
                                }else{
                                    console.log(result.response.data)
                                }
                                
                            }catch(err){
                                console.log(err.response);
                                
                            }
                        }
        }
    }
  return (
    <motion.div
    className="bg-white rounded-lg shadow-lg p-6 w-96"
    initial={{ scale: 0.8 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0.8 }}
>
    <div className="flex justify-between items-center">
        <h2 className="text-lg text-gray-600 font-bold">Add Table</h2>
        <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
        >
            ✕  
        </button>
    </div>
    <form >
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
                 Table_number
            </label>
            <input
                type="text"
                name="table_number"
                value={formdata.table_number}
                onChange={e=>setFormdata({...formdata,table_number:e.target.value})}
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
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
                            onClick={handleSubmit}
                        >
                            Add Table   
                        </button>
                    </div>
        </form>
    </motion.div>
  )
}

export default Addtables