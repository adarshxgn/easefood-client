import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import Addtables from './Addtables';
import { deleteTableApi, getTableApi } from '../../services/allApi';
import { tableaddResponceContext, tableEditResponceContext } from '../../pages/context/ContextShare';
import EditTables from './EditTables';

const Tables = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const { tableaddResponce } = useContext(tableaddResponceContext);
  const { tableEditResponce, setTableEditResponce } = useContext(tableEditResponceContext);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    const fetchTable = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const reqHeader = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };
        try {
          const result = await getTableApi(reqHeader);
          console.log(result);
          if (result.status === 200) {
            setTables(result.data);
          } else {
            console.log(result.response.data);
          }
        } catch (err) {
          console.log(err.response);
        }
      }
    };
    fetchTable();
  }, [tableaddResponce, tableEditResponce]);

  const deleteTable = async (tableId) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      try {
        const result = await deleteTableApi(tableId, reqHeader);
        console.log(result);
        if (result.status === 204) {
          const newTables = tables.filter((table) => table.id !== tableId);
          setTables(newTables);
        } else {
          console.log(result.response.data);
        }
      } catch (err) {
        console.log(err.response);
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleEditTable = (table) => () => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleEditTableSubmit = (updatedTable) => {
    const updatedTables = tables.map((table) =>
      table.id === updatedTable.id ? updatedTable : table
    );
    setTables(updatedTables);
    setTableEditResponce(updatedTable);
    closeModal();
  };

  return (
    <motion.div className="mb-6" style={{ minHeight: "60vh" }}>
      <div className='grid grid-cols-1 gap-1 lg:grid-cols-2'>
        <div>
          <button
            className="text-lg rounded-lg bg-blue-700 hover:bg-blue-800 text-blue-100 m-5 p-1"
            onClick={openModal}
          >
            Add Tables
          </button>
          {isModalOpen && !selectedTable && <Addtables onClose={closeModal} />}
        </div>

        <div className="grid grid-cols-3 gap-9 lg:grid-cols-4">
          {tables.length > 0 ? tables.map((table, index) => (
            <div className="table-container relative" key={index}>
              {/* Top Chair */}
              <div className="chair top-chair"></div>

              {/* Table */}
              <button className="table-btn relative" variant="primary">
                {table.table_number}
                <div className="hover-buttons absolute top-0 mt-10 left-0 w-full h-full flex justify-center items-center space-x-2 opacity-0 hover:opacity-100">
                  <button onClick={handleEditTable(table)} className="bg-gray-900 text-white px-2 py-1 rounded"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button onClick={() => deleteTable(table.id)} className="bg-gray-900 text-white px-2 py-1 rounded"><i className="fa-solid fa-trash"></i></button>
                </div>
              </button>

              {/* Bottom Chair */}
              <div className="chair bottom-chair"></div>

              {/* Left Chair */}
              <div className="chair left-chair"></div>

              {/* Right Chair */}
              <div className="chair right-chair"></div>
            </div>
          )) : (
            <p>No tables added</p>
          )}
        </div>
      </div>
      {
        isModalOpen && selectedTable && <EditTables onClose={closeModal} table={selectedTable} onSubmit={handleEditTableSubmit} />
      }
    </motion.div>
  );
};

export default Tables;