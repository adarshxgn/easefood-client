import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AuthPage from "./pages/auth/AuthPage";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import DishesPage from "./pages/dishespage/DishesPage";
import OdersPage from "./pages/oderpage/OdersPage";
import Tablepages from "./pages/tablepage/Tablepages";
import CategoryPage from "./pages/Category/CategoryPage";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register="register" />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoutes>
              <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dishes" element={<DishesPage/>} />
                    <Route path="/orders" element={<OdersPage/>} />
                    <Route path="/tables" element={<Tablepages/>}/>
                    <Route path="/category" element={<CategoryPage/>}/>
                  </Routes>
              </div>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App;
