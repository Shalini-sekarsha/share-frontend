
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSignOutAlt } from 'react-icons/fa'; 
import logo from '../src/logo.png'; 
const STOCK_DETAILS_URL = 'http://localhost:8080/stocks/details'; 
const LATEST_PRICE_URL = 'http://localhost:8080/stockprices/latest'; 
const BUY_URL = 'http://localhost:8080/buy/insert'; 
const StockDetails = () => {
    const [stock, setStock] = useState(null);
    const [latestPrice, setLatestPrice] = useState(null);
    const [quantity, setQuantity] = useState(0); 
    const [totalPrice, setTotalPrice] = useState(0); 
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const stockId = sessionStorage.getItem('selectedStockId');
                
                if (!stockId) {
                    throw new Error('No stock ID found in session storage.');
                }

                const stockResponse = await axios.get(`${STOCK_DETAILS_URL}/${stockId}`);
                setStock(stockResponse.data);

            } catch (error) {
                console.error('Error fetching stock data:', error);
                setError('There was an error fetching stock data.');
            }
        };

        fetchStockData();
    }, []);

    const handleAddClick = async () => {
        try {
            const stockId = sessionStorage.getItem('selectedStockId');
            
            if (!stockId) {
                throw new Error('No stock ID found in session storage.');
            }

            const response = await axios.get(`${LATEST_PRICE_URL}/${stockId}`);
            if (response.data) {
                setLatestPrice(response.data);
            } else {
                throw new Error('No data returned from the latest price API.');
            }
        } catch (error) {
            console.error('Error fetching latest stock price:', error);
            setError('There was an error fetching the latest stock price.');
        }
    };

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + change;
            if (newQuantity < 0) return 0; 
            return newQuantity;
        });
    };

    useEffect(() => {
        if (latestPrice) {
            setTotalPrice(quantity * latestPrice.changePrice); 
        }
    }, [quantity, latestPrice]);

    const handleSubmit = async () => {
        try {
            if (!stock || !latestPrice) {
                throw new Error('Stock or latest price data is missing.');
            }

            const stockId = sessionStorage.getItem('selectedStockId');
            const selectedPortfolio = JSON.parse(sessionStorage.getItem('selectedPortfolio'));
            const userId = sessionStorage.getItem('userId');

            if (!stockId || !selectedPortfolio || !userId) {
                throw new Error('No stock ID, portfolio object, or user ID found in session storage.');
            }

            const buyData = {
                quantity: quantity,
                changePrice: latestPrice.changePrice,
                totalPrice: totalPrice,
                user: {
                    userId: parseInt(userId, 10)
                },
                stock: {
                    stockId: parseInt(stockId, 10)
                },
                portfolio: {
                    portfolioId: parseInt(selectedPortfolio.portfolioId, 10)
                }
            };

            await axios.post(BUY_URL, buyData);

            const existingPurchases = JSON.parse(localStorage.getItem('purchaseDetails')) || [];
            existingPurchases.push({
                companyname: stock.companyname,
                symbol: stock.symbol,
                changePrice: latestPrice.changePrice,
                quantity: quantity,
                totalPrice: totalPrice
            });
            localStorage.setItem('purchaseDetails', JSON.stringify(existingPurchases));

            toast.success('Purchase successfully recorded!', {
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
        } catch (error) {
            console.error('Error submitting buy data:', error);
            toast.error(`There was an error submitting your purchase: ${error.message}`, {
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

    const handleCancel = () => {
        navigate('/ViewStock');
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

                {stock ? (
                    <div className="bg-gray-700 shadow-lg rounded-lg p-6 border border-gray-600 w-full max-w-lg">
                        <h3 className="text-2xl font-semibold text-yellow-300 mb-2">{stock.companyname}</h3>
                        <p className="text-gray-400 mb-1">Symbol: <span className="font-medium text-yellow-400">{stock.symbol}</span></p>
                        <p className="text-gray-400">Initial Price: <span className="font-medium text-yellow-400">₹{stock.shareprice}</span></p>
                        <button
                            onClick={handleAddClick}
                            className="mt-4 text-blue-500 hover:text-blue-700"
                        >
                            Get Latest Price
                        </button>
                        {latestPrice && (
                            <div className="mt-4 p-2 bg-gray-600 border border-gray-500 rounded">
                                <h4 className="text-lg font-semibold text-yellow-300">Latest Price:</h4>
                                <p className="text-gray-400">Price: ₹{latestPrice.changePrice}</p>
                            </div>
                        )}
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-yellow-300">Quantity:</h4>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="bg-gray-600 text-gray-300 px-4 py-2 rounded-l"
                                >
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    className="border border-gray-500 text-center w-16 bg-gray-800 text-yellow-400"
                                />
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="bg-gray-600 text-gray-300 px-4 py-2 rounded-r"
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="mt-2">
                                <h4 className="text-lg font-semibold text-yellow-300">Total Price:</h4>
                                <p className="text-gray-400">₹{totalPrice}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faCheck} />
                                <span>Submit</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-yellow-400">Loading...</p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default StockDetails;
