import { BarChart2, LogOut, Menu, ChartBarStacked, ShoppingBag, ShoppingCart, TrendingUp, Users,AlignEndHorizontal, Dice4 } from "lucide-react";
import { useState } from "react";
import { AnimatePresence , motion} from "motion/react"
import { Link } from "react-router-dom";
const pin = localStorage.getItem("pin");
const SIDEBAR_ITEMS = [
	{ name: "Dashboard", icon:BarChart2, color: "#10B981", href: "/dashboard" },
	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
	{ name: "Tables", icon: Dice4, color: "#28b463", href: "/tables" },
	{ name: "Dishes", icon: ShoppingBag, color: "#2980b9", href: "/dishes" },
	{ name: "Category", icon: AlignEndHorizontal, color: "#8B5CF6", href: "/category" },
	{
		name: "logout",
		icon: LogOut,
		color: "#EF4444",
		href: "/",
		onClick: () => {
			localStorage.clear();
			sessionStorage.clear();
		}
	},
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
				pin: {pin}
			</div>
		</motion.div>
	);
};
export default Sidebar;
