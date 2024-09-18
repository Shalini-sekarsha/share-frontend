
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (formData.userPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/user/doUserInsert', {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
      });

      toast.success(<><FaCheck className="inline-block mr-2" /> User registered successfully!</>, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });

      setTimeout(() => {
        history('/UserLogin'); 
      }, 3000);
    } catch (err) {
      toast.error(<><FaTimes className="inline-block mr-2" /> An error occurred while registering the user.</>, {
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
    
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900 text-yellow-400 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <FaUser className="text-gray-400 w-12 h-12 p-3 bg-gray-700" />
              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-3 border-0 focus:outline-none text-gray-900"
                required
              />
            </div>

            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <FaEnvelope className="text-gray-400 w-12 h-12 p-3 bg-gray-700" />
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                value={formData.userEmail}
                onChange={handleChange}
                className={`w-full p-3 border-0 focus:outline-none text-gray-900 ${error ? 'border-red-500' : ''}`}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <FaLock className="text-gray-400 w-12 h-12 p-3 bg-gray-700" />
              <input
                type="password"
                name="userPassword"
                placeholder="Password"
                value={formData.userPassword}
                onChange={handleChange}
                className="w-full p-3 border-0 focus:outline-none text-gray-900"
                required
              />
            </div>

            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
              <FaLock className="text-gray-400 w-12 h-12 p-3 bg-gray-700" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border-0 focus:outline-none text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 bg-yellow-500 text-gray-800 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-400">Already have an account? <button onClick={() => history('/UserLogin')} className="text-yellow-500 underline">Login</button></p>
          </div>
        </div>
      </div>

     
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
