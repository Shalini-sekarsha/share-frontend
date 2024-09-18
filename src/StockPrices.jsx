
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faEdit, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../src/logo.png';  

const SharePrices = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [companyname, setCompanyname] = useState('');
  const [symbol, setSymbol] = useState('');
  const [changePrice, setChangePrice] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/stocks/idlist')
      .then(response => {
        setStocks(response.data);
      })
      .catch(error => {
        console.error('Error fetching stock details:', error);
      });
  }, []);

  useEffect(() => {
    if (companyname) {
      setFilteredStocks(stocks.filter(stock => stock.companyname.toLowerCase().includes(companyname.toLowerCase())));
    } else {
      setFilteredStocks([]);
    }
  }, [companyname, stocks]);

  useEffect(() => {
    if (selectedStock) {
      axios.get(`http://localhost:8080/stocks/details/${selectedStock}`)
        .then(response => {
          const stock = response.data;
          setCompanyname(stock.companyname);
          setSymbol(stock.symbol);
        })
        .catch(error => {
          console.error('Error fetching stock details:', error);
        });
    }
  }, [selectedStock]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyname || !changePrice || !updatedDate) {
      setError("All fields are required.");
      return;
    }

    setError(null);

    try {
      const stockPrice = {
        stock: { stockId: selectedStock },
        changePrice: parseFloat(changePrice),
        updatedDate
      };

      await axios.put('http://localhost:8080/stockprices/doStockPriceDetailsUpdate', stockPrice);

      toast.success('Stock price updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
      });

      setTimeout(() => {
        navigate('/AdminDashboard');
      }, 3000);
    } catch (error) {
      setError('Error saving stock price.');
      toast.error('Error saving stock price.', {
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
    navigate('/AdminDashboard');
  };

  const handleLogout = () => {
    navigate('/AdminDashboard');
    console.log('Logging out');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
     
      <nav className="bg-gray-900 text-yellow-500 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
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

   
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400 flex items-center">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Change Price
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="companyname" className="block text-sm font-medium text-gray-300">Company Name</label>
            <input
              id="companyname"
              type="text"
              value={companyname}
              onChange={(e) => setCompanyname(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:text-sm"
              placeholder="Enter the company name..."
            />
            {filteredStocks.length > 0 && (
              <ul className="mt-2 absolute bg-gray-800 border border-gray-600 rounded-lg max-h-48 overflow-auto w-full z-10 shadow-lg">
                {filteredStocks.map(stock => (
                  <li
                    key={stock.stockId}
                    className="p-2 cursor-pointer text-gray-200 hover:bg-gray-600"
                    onClick={() => {
                      setCompanyname(stock.companyname);
                      setSymbol(stock.symbol);
                      setSelectedStock(stock.stockId);
                      setFilteredStocks([]);
                    }}
                  >
                    {stock.companyname}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
            <div className="p-3 bg-gray-700">
              <FontAwesomeIcon icon={faTag} className="text-yellow-500" />
            </div>
            <input
              type="text"
              value={symbol}
              readOnly
              className="w-full p-2 border-0 bg-gray-800 text-white rounded-lg focus:outline-none"
            />
          </div>

          <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
            <div className="p-3 bg-gray-700">
              <FontAwesomeIcon icon={faDollarSign} className="text-yellow-500" />
            </div>
            <input
              type="number"
              step="0.01"
              id="changePrice"
              value={changePrice}
              onChange={(e) => setChangePrice(e.target.value)}
              className={`w-full p-2 border-0 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${error ? 'border-red-500' : ''}`}
              placeholder="Change Price"
            />
          </div>

          <div className="mb-4 flex items-center border border-gray-600 rounded-lg">
            <div className="p-3 bg-gray-700">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-500" />
            </div>
            <input
              type="date"
              id="date"
              value={updatedDate}
              onChange={(e) => setUpdatedDate(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-md shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" /> Update Price
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 py-2 bg-gray-600 text-white font-bold rounded-md shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SharePrices;
