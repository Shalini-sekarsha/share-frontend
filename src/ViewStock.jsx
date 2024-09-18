
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { FaSignOutAlt } from 'react-icons/fa'; 
import logo from '../src/logo.png'; 

const STOCKS_URL = 'http://localhost:8080/stocks/all'; 

const ViewStock = () => {
    const [stocks, setStocks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get(STOCKS_URL);
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching stocks:', error);
                setError('There was an error fetching stock data.');
            }
        };

        fetchStocks();
    }, []);

    const handleMoreInfoClick = (stockId) => {
        sessionStorage.setItem('selectedStockId', stockId); 
        navigate('/StockDetails'); 
    };

   
    const Navbar = () => {
        const handleLogout = () => {
           
            navigate('/ViewPortfolio');
            console.log('Logging out');
        };

        return (
            <nav className="bg-gray-900 text-yellow-400 p-4 fixed top-0 left-0 w-full z-10 shadow-lg">
                <div className="container mx-auto flex items-center justify-between">
                 
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="Logo" className="w-8 h-8" />
                        <span className="text-xl font-bold">Trender</span>
                    </div>

                   
                    <div className="flex space-x-6">
                        <button onClick={handleLogout} className="hover:text-yellow-300 flex items-center">
                            <FaSignOutAlt className="mr-2 text-xl" /> GoBack
                        </button>
                    </div>
                </div>
            </nav>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-800">
            <Navbar /> 

            <div className="pt-16 p-6 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6">Stock Details</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stocks.map(stock => (
                        <div key={stock.stockId} className="bg-gray-700 shadow-lg rounded-lg overflow-hidden border border-gray-600 transition-transform transform hover:scale-105 flex flex-col">
                            <div className="p-6 flex-1">
                                <h3 className="text-2xl font-semibold text-yellow-300 mb-2">{stock.companyname}</h3>
                                <p className="text-gray-400 mb-1">Symbol: <span className="font-medium text-yellow-400">{stock.symbol}</span></p>
                                <p className="text-gray-400">Initial Price: <span className="font-medium text-yellow-400">₹{stock.shareprice}</span></p>
                            </div>
                            <div className="bg-gray-600 p-4 text-center">
                                <button
                                    onClick={() => handleMoreInfoClick(stock.stockId)} // Pass only stock ID
                                    className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-2 px-4 border border-transparent rounded-lg shadow-md transition-colors duration-300"
                                >
                                    More Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewStock;
