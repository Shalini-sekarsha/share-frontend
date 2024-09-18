import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaDollarSign, FaSignOutAlt } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import logo from '../src/logo.png';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement } from 'chart.js';


ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement);

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-yellow-500 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
      
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Trender</span>
        </div>

      
        <div className="flex space-x-6">
          <Link to="/Home" className="hover:text-yellow-300 flex items-center">
            <FaHome className="mr-2 text-xl" /> Home
          </Link>
          <Link to="/Stocks" className="hover:text-yellow-300 flex items-center">
            <FaChartLine className="mr-2 text-xl" /> Manage Stocks
          </Link>
          <Link to="/StockPrices" className="hover:text-yellow-300 flex items-center">
            <FaDollarSign className="mr-2 text-xl" /> Stock Prices
          </Link>
          <button onClick={handleLogout} className="hover:text-yellow-300 flex items-center">
            <FaSignOutAlt className="mr-2 text-xl" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};


const AdminDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const stockResponse = await axios.get('http://localhost:8080/stocks/all');
        setStocks(stockResponse.data);

        
        const pricePromises = stockResponse.data.map(stock => 
          axios.get(`http://localhost:8080/stockprices/latest/${stock.stockId}`)
        );
        const priceResponses = await Promise.all(pricePromises);
        setStockPrices(priceResponses.map(response => response.data));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stockCount = stocks.length;

 
  const pieData = {
    labels: stocks.map(stock => stock.companyname),
    datasets: [
      {
        label: 'Stock Distribution',
        data: stocks.map(stock => stock.stockId), 
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 205, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const barData = {
    labels: stocks.map(stock => stock.symbol), 
    datasets: [
      {
        label: 'Latest Stock Prices',
        data: stockPrices.map(price => price.changePrice), 
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 0, 0.8)' 
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `₹${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom'
      }
    }
  };

  if (loading) return <div className="text-center py-4 text-yellow-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-600">
      <Navbar />
      <main className="pt-16 p-4">
      
        <div className="bg-gray-800 text-yellow-400 p-4 rounded-lg shadow-lg mb-6 w-full max-w-xs mx-auto">
          <h2 className="text-xl font-bold mb-2">Number of Stocks</h2>
          <p className="text-3xl font-semibold">{stockCount}</p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4">Stock Distribution</h3>
            <div className="h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

         
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4">Latest Stock Prices</h3>
            <div className="h-64">
              <Bar
                data={barData}
                options={{
                  ...chartOptions,
                  scales: {
                    x: {
                      ticks: {
                        color: 'rgba(255, 255, 0, 0.8)',
                        maxRotation: 45,
                        minRotation: 45
                      },
                      title: {
                        display: true,
                        text: 'Stock Symbols',
                        color: 'rgba(255, 255, 0, 0.8)',
                        font: {
                          size: 14
                        }
                      }
                    },
                    y: {
                      ticks: {
                        color: 'rgba(255, 255, 0, 0.8)', 
                        callback: value => `₹${value}`
                      },
                      title: {
                        display: true,
                        text: 'Price',
                        color: 'rgba(255, 255, 0, 0.8)',
                        font: {
                          size: 14
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Stocks" element={<Stocks />} />
          <Route path="/StockPrices" element={<StockPrices />} />
          <Route path="/" element={<Home />} /> {/* Default route */}
        </Routes>
      </main>
    </div>
  );
};


const Home = () => {
  return (
    <div>
      {/* <h2 className="text-2xl font-bold mb-4">Home</h2>
      <p>Welcome to the admin dashboard home page. This is where you can get a summary of the stock market status.</p> */}
    </div>
  );
};


const Stocks = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Stocks</h2>
      <p>Here you can view and manage stock information.</p>
    </div>
  );
};

const StockPrices = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stock Prices</h2>
      <p>View the current stock prices here.</p>
    </div>
  );
};

export default AdminDashboard;
