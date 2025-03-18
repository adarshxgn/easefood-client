import React from "react";
import { motion } from "motion/react"
import Header from "../../components/common/Header";
import Category from "../../components/categores/Category";


const CategoryPage = () => {
  return (
    <div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Category"} />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					
				</motion.div>
                <Category/>
			</main>
		</div>
  )
}

export default CategoryPage