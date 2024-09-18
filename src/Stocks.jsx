
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../src/logo.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { FaHome, FaChartLine, FaDollarSign as FaDollarSignIcon, FaSignOutAlt } from 'react-icons/fa'; 

const Navbar = () => {
  const navigate = useNavigate(); 
  const handleLogout = () => {
   
    navigate('/AdminDashboard');
    console.log('Logging out');
  };

  return (
    <nav className="bg-gray-900 text-yellow-500 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
    
        <div className="flex items-center space-x-2">
          <img src=
          {logo} alt="Logo" className="w-8 h-8" /> {/* Update the logo path as needed */}
          <span className="text-xl font-bold">Trender</span>
        </div>

    
        <div className="flex space-x-6">
          {/* <Link to="/AdminDashboard" className="hover:text-yellow-300 flex items-center">
            <FaHome className="mr-2 text-xl" /> Home
          </Link>
          <Link to="/Stocks" className="hover:text-yellow-300 flex items-center">
            <FaChartLine className="mr-2 text-xl" /> Manage Stocks
          </Link>
          <Link to="/StockPrices" className="hover:text-yellow-300 flex items-center">
            <FaDollarSignIcon className="mr-2 text-xl" /> Stock Prices
          </Link> */}
          <button onClick={handleLogout} className="hover:text-yellow-300 flex items-center">
            <FaSignOutAlt className="mr-2 text-xl" /> GoBack
          </button>
        </div>
      </div>
    </nav>
  );
};

const Stocks = () => {
  const [companyname, setCompanyname] = useState('');
  const [symbol, setSymbol] = useState('');
  const [sharePrice, setSharePrice] = useState('');
  const [error, setError] = useState(null);
  const [stocks, setStocks] = useState([]);  // State to keep track of stocks

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyname || !symbol || !sharePrice) {
      setError("All fields are required.");
      return;
    }

    setError(null); 

    try {
      const stockData = {
        companyname: companyname,
        symbol: symbol,
        shareprice: parseFloat(sharePrice)  
      };

      
      const response = await axios.post('http://localhost:8080/stocks/createStock', stockData);

    
      setStocks([...stocks, response.data]);

      toast.success('Stock added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });

     
      setCompanyname('');
      setSymbol('');
      setSharePrice('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Stock with this company name already exists.');
        toast.error('Stock with this company name already exists.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark"
        });
      } else {
        setError('Error stock already exists.');
        toast.error('Error adding stock.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar /> 

      <div className="pt-16 p-6 flex flex-col items-center">
        <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Add New Stock
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
              <div className="p-3 bg-gray-700">
                <FontAwesomeIcon icon={faBuilding} className="text-yellow-500" />
              </div>
              <input
                type="text"
                value={companyname}
                onChange={(e) => setCompanyname(e.target.value)}
                placeholder="Enter company name"
                className="w-full p-2 border-0 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
              <div className="p-3 bg-gray-700">
                <FontAwesomeIcon icon={faTag} className="text-yellow-500" />
              </div>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter symbol name"
                className="w-full p-2 border-0 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
              <div className="p-3 bg-gray-700">
                <FontAwesomeIcon icon={faDollarSign} className="text-yellow-500" />
              </div>
              <input
                type="number"
                step="0.01"
                value={sharePrice}
                onChange={(e) => setSharePrice(e.target.value)}
                placeholder="Enter share price"
                className={`w-full p-2 border-0 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${error ? 'border-red-500' : ''}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-yellow-500 text-gray-900 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300 ease-in-out flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              Add Stock
            </button>
          </form>
          <ToastContainer />
        </div>

        {/* Uncomment this section to display the list of stocks */}
        {/* <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Stock List
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {stocks.map((stock, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-yellow-400">{stock.companyname}</h3>
                <p className="text-gray-300">Symbol: {stock.symbol}</p>
                <p className="text-gray-300">Share Price: ₹{stock.shareprice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Stocks;
