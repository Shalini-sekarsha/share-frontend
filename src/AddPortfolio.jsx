import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AddPortfolio = () => {
    const [portfolioname, setPortfolioname] = useState('');
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
    const navigate = useNavigate();

    const handleCreatePortfolio = async () => {
        if (!portfolioname.trim()) {
            setError('Portfolio name is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/portfolio/create', {
                portfolioname: portfolioname,
                user: { userId: userId }
            });

            if (response.status === 200) {
                const { portfolioId, portfolioname } = response.data;

              
                const portfolios = JSON.parse(sessionStorage.getItem('portfolios')) || [];
                portfolios.push({ portfolioId, portfolioname });
                sessionStorage.setItem('portfolios', JSON.stringify(portfolios));

                toast.success(<><FaCheck className="inline-block mr-2" /> Portfolio created successfully!</>, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark"
                });

                setTimeout(() => {
                    navigate('/ViewPortfolio');
                }, 3000);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error creating portfolio:', error.response ? error.response.data : error.message);
            toast.error(<><FaTimes className="inline-block mr-2" /> There was an error creating the portfolio.</>, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark"
            });
        }
    };

    return (
        <div className="flex h-screen bg-gray-800 items-center justify-center">
            <div className="p-6 max-w-md mx-auto bg-gray-900 text-yellow-400 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Create Portfolio</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={portfolioname}
                        onChange={(e) => setPortfolioname(e.target.value)}
                        placeholder="Enter portfolio name"
                        className="border border-gray-600 rounded-lg p-3 w-full bg-gray-800 text-gray-100"
                    />
                </div>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <button
                    onClick={handleCreatePortfolio}
                    className="w-full py-3 bg-yellow-400 text-white rounded-lg shadow-lg hover:bg-yellow-300 transition duration-300 ease-in-out"
                >
                    Create
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddPortfolio;
