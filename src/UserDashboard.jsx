
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaHome, FaCog, FaEye, FaSignOutAlt } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import logo from '../src/logo.png'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import sample from './video.mp4.mp4'; 

const Home = () => <div className="p-6">Welcome to the Share Market Dashboard</div>;
const ManagePortfolio = () => <div className="p-6">This is the Portfolio Management Page</div>;
const ViewPortfolio = () => <div className="p-6">View Your Portfolio</div>;


const Navbar = () => {
  const navigate = useNavigate();

  const handleSelect = (page) => {
    if (page === 'logout') {
    
      toast.success('Successfully logging out!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });

    
      setTimeout(() => {
        navigate('/');
      }, 3000); 
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <nav className="bg-gray-900 text-yellow-500 p-4 fixed top-0 left-0 w-full z-20 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Trender</span>
        </div>
        <div className="flex space-x-4">
          <button 
            className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
            onClick={() => handleSelect('Home')}
          >
            <FaHome className="mr-2 text-xl" /> Home
          </button>
          <button 
            className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
            onClick={() => handleSelect('ViewPortfolio')}
          >
            <FaCog className="mr-2 text-xl" /> Manage Portfolio
          </button>
          <button 
            className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
            onClick={() => handleSelect('UserBuys')}
          >
            <FaEye className="mr-2 text-xl" /> View Portfolio
          </button>
          <button 
            className="flex items-center p-2 hover:bg-gray-700 rounded transition-colors duration-200"
            onClick={() => handleSelect('logout')}
          >
            <FaSignOutAlt className="mr-2 text-xl" /> Logout
          </button>
        </div>
      </div>
      <ToastContainer /> 
    </nav>
  );
};


const UserDashboard = () => (
  <div className="h-screen flex flex-col bg-gray-600">
    <Navbar />
    <div className="relative flex-1">
     
      <video
        src={sample}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      >
        Your browser does not support the video tag.
      </video>
   
      <div className="absolute flex flex-col items-start right-10 top-1/2 transform -translate-y-1/2 p-6 bg-gray-800 bg-opacity-80 text-yellow-400 rounded-lg shadow-lg z-10 max-w-md">
        <p className="text-lg font-semibold">
        Welcome to Trader! This platform allows you to seamlessly manage your investment portfolio and track your shares. With our intuitive tools, you can monitor market performance, analyze trends, and make informed decisions to optimize your financial growth.
        </p>
      </div>
      <main className="relative z-10 p-6 bg-gray-100 flex-1">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/ViewPortfolio" element={<ManagePortfolio />} />
          <Route path="/UserBuys" element={<ViewPortfolio />} />
        </Routes>
      </main>
    </div>
  </div>
);

export default UserDashboard;
