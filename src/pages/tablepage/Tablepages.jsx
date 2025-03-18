import React from 'react'
import { motion } from 'motion/react'
import Header from '../../components/common/Header'
import Tables from '../../components/Table/Tables'
const Tablepages = () => {
  return (
    <div className='flex-1 relative z-10 overflow-auto'>
   <Header title={"Tables"} />
   <motion.div
          className="sm:grid-cols-2 p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
              >
             <div className='bg-gray-700 bg-opacity-50 backdrop-blur-md shadow-lg p-6 rounded-lg'>
                  <Tables/>
             </div>
          </motion.div>
   </div>
  )
}

export default Tablepages