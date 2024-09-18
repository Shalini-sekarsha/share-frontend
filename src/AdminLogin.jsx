
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import image from '../src/image.png';
import Navbar from './Navbar';

const AdminLogin = () => {
  const [adminname, setAdminname] = useState('');
  const [adminpassword, setAdminpassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      const response = await axios.get(`http://localhost:8080/admin/loginadmin/${adminname}/${adminpassword}`);

      if (response.data) {
        toast.success(<><FaCheck className="inline-block mr-2" /> Successfully logged in!</>, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark"
        });

       
        setTimeout(() => {
          window.location.href = '/AdminDashboard';
        }, 3000); 
      } else {
        toast.error(<><FaTimes className="inline-block mr-2" /> Login failed. Please check your credentials.</>, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark"
        });
      }
    } catch (error) {
      toast.error(<><FaTimes className="inline-block mr-2" /> An error occurred. Please try again later.</>, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="flex h-screen bg-gray-800">
  
      <div className="flex-1 hidden md:flex items-center justify-center bg-gray-900">
        <img src={image} alt="Login Graphic" className="w-full h-full object-cover" />
      </div>
    
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900 text-yellow-400 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <FaUser className="text-gray-400 w-12 h-12 p-3 bg-gray-700" />
              <input
                type="text"
                placeholder="Username"
                value={adminname}
                onChange={(e) => setAdminname(e.target.value)}
                className="w-full p-3 border-0 focus:outline-none text-gray-900"
                required
              />
            </div>
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <FaLock className="text-gray-400 w-12 h-12 p-3 bg-gray-700" />
              <input
                type="password"
                placeholder="Password"
                value={adminpassword}
                onChange={(e) => setAdminpassword(e.target.value)}
                className="w-full p-3 border-0 focus:outline-none text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 bg-yellow-500 text-gray-800 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

  
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
