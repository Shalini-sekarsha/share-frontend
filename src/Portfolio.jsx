
import axios from 'axios';
import React, { useState, useEffect } from 'react';


const STOCKS_URL = 'http://localhost:8080/stocks/all'; // Endpoint to get all stocks
const STOCK_PRICES_URL = 'http://localhost:8080/stockprices/latest/'; // Endpoint to get stock prices by stockId
const PORTFOLIO_URL = 'http://localhost:8080/portfolio/create'; // Endpoint to create a portfolio
const PORTFOLIOS_URL = 'http://localhost:8080/portfolio/all'; // Endpoint to get all portfolios

const Portfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [changePrice, setChangePrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
   
    const fetchStocks = async () => {
      try {
        const response = await fetch(STOCKS_URL);
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
  
    const fetchChangePrice = async () => {
      if (selectedStockId) {
        try {
          const response = await axios.get(`${STOCK_PRICES_URL}${selectedStockId}`);
          setChangePrice(response.data.changePrice);
        } catch (error) {
          console.error('Error fetching stock price:', error);
        }
      }
    };

    fetchChangePrice();
  }, [selectedStockId]);

  useEffect(() => {
   
    const fetchCompanyName = async () => {
      if (selectedStockId) {
        try {
          const response = await axios.get(`http://localhost:8080/stocks/GetStockId/${selectedStockId}`);
          setSelectedCompanyName(response.data.companyname);
        } catch (error) {
          console.error('Error fetching company name:', error);
        }
      }
    };

    fetchCompanyName();
  }, [selectedStockId]);

  useEffect(() => {
   
    setTotalPrice(changePrice * quantity);
  }, [changePrice, quantity]);

  useEffect(() => {
   
    const fetchPortfolios = async () => {
      try {
        const response = await fetch(PORTFOLIOS_URL);
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolios();
  }, []);

  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + delta));
  };

  const handleSubmit = async () => {
    if (selectedStockId && quantity > 0) {
      const portfolio = {
        stocks: [{ stockId: selectedStockId }],
        companyname: selectedCompanyName,
        quantity,
        totalPrice: totalPrice.toFixed(2),
        changePrice,
      };

      try {
        const response = await fetch(PORTFOLIO_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(portfolio),
        });

        if (response.ok) {
          const result = await response.json();
          alert('Portfolio created successfully!');
          setIsModalOpen(false);
          // Refresh the portfolios list
          const updatedPortfolios = await fetch(PORTFOLIOS_URL).then(res => res.json());
          setPortfolios(updatedPortfolios);
        } else {
          console.error('Error creating portfolio:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating portfolio:', error);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
      >
        Create Portfolio
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 relative">
            <h2 className="text-lg font-semibold mb-4">Create Portfolio</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="stockDropdown" className="block text-sm font-medium text-gray-700">Company</label>
                <select
                  id="stockDropdown"
                  onChange={(e) => setSelectedStockId(e.target.value)}
                  value={selectedStockId}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a company</option>
                  {stocks.map((stock) => (
                    <option key={stock.stockId} value={stock.stockId}>
                      {stock.companyname}
                    </option>
                  ))}
                </select>
                {selectedStockId && (
                  <p className="text-sm font-medium text-gray-700 mt-2">Change Price: ₹{changePrice}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 bg-gray-200 rounded-l-md border border-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    id="quantity"
                    className="w-16 text-center border-gray-300 rounded-md"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 bg-gray-200 rounded-r-md border border-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Total Price: ₹{totalPrice.toFixed(2)}</p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400"
              >
                OK
              </button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

    
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Portfolios</h2>
        <ul>
          {portfolios.map((portfolio) => (
            <li key={portfolio.id} className="mb-2 p-4 border rounded-md shadow-sm">
              <p><strong>Company:</strong> {portfolio.companyname}</p>
              <p><strong>Quantity:</strong> {portfolio.quantity}</p>
              <p><strong>Total Price:</strong> ₹{portfolio.totalPrice}</p>
              <p><strong>Change Price:</strong> ₹{portfolio.changePrice}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Portfolio;

