
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, LineElement, PointElement, Title, Tooltip, Legend, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; 
import { FaSignOutAlt } from 'react-icons/fa'; 
import logo from '../src/logo.png'; 
import { useNavigate } from 'react-router-dom'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale, 
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const STOCKS_URL = 'http://localhost:8080/stocks/all';

const Navbar = () => {
    const navigate = useNavigate(); 

    const handleLogout = () => {
      
        console.log('Logging out');
        navigate('/UserBuys'); 
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

const Stockgraph = () => {
    const [stockData, setStockData] = useState({});
    const [stockDetails, setStockDetails] = useState({});
    const [stockIds, setStockIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockIds = async () => {
            try {
                const response = await axios.get(STOCKS_URL);
                const ids = response.data.map(stock => stock.stockId);
                setStockIds(ids);
                await fetchStockDetails(ids);
                await fetchStockPrices(ids);
            } catch (err) {
                setError('Error fetching stock IDs.');
                setLoading(false);
            }
        };

        const fetchStockDetails = async (ids) => {
            try {
                const stockDetailPromises = ids.map(id =>
                    axios.get(`http://localhost:8080/stocks/GetStockId/${id}`)
                );
                const responses = await Promise.all(stockDetailPromises);
                const data = responses.reduce((acc, res) => {
                    acc[res.data.stockId] = res.data;
                    return acc;
                }, {});
                setStockDetails(data);
            } catch (err) {
                setError('Error fetching stock details.');
            }
        };

        const fetchStockPrices = async (ids) => {
            try {
                const stockPricePromises = ids.map(id =>
                    axios.get(`http://localhost:8080/stockprices/stock/${id}`)
                );
                const responses = await Promise.all(stockPricePromises);
                const data = responses.reduce((acc, res, index) => {
                    acc[ids[index]] = res.data;
                    return acc;
                }, {});
                setStockData(data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching stock prices.');
                setLoading(false);
            }
        };

        fetchStockIds();
    }, []);

    const formatDataForChart = (data) => {
        const sortedData = data.sort((a, b) => new Date(a.updatedDate) - new Date(b.updatedDate));
        const labels = sortedData.map(price => new Date(price.updatedDate));
        const prices = sortedData.map(price => price.changePrice);

        return {
            labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Stock Prices',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
                {
                    type: 'line',
                    label: 'Stock Prices (Points)',
                    data: prices,
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    radius: 5,
                    pointStyle: 'circle',
                    fill: false,
                }
            ]
        };
    };

    const generateChartData = (stockId) => {
        const stockPrices = stockData[stockId] || [];
        return formatDataForChart(stockPrices);
    };

    const renderCombinedChart = (stockId) => {
        const details = stockDetails[stockId] || {};
        return (
            <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600 p-4 mb-6">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">{details.companyname} ({details.symbol})</h3>
                <Line
                    data={generateChartData(stockId)}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: 'rgba(255, 255, 0, 0.8)', // Legend label color
                                    font: {
                                        size: 12,
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return `Price: ₹${tooltipItem.raw}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day',
                                    tooltipFormat: 'MMM dd',
                                    displayFormats: {
                                        day: 'MMM dd',
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Date',
                                    color: 'rgba(255, 255, 0, 0.8)',
                                    font: {
                                        size: 12,
                                        color: 'rgba(255, 255, 0, 0.8)', // X-axis label color
                                    }
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 0, 0.8)', // X-axis tick color
                                    maxTicksLimit: 5,
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Price',
                                    color: 'rgba(255, 255, 0, 0.8)',
                                    font: {
                                        size: 12,
                                        color: 'rgba(255, 255, 0, 0.8)', // Y-axis label color
                                    }
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 0, 0.8)', // Y-axis tick color
                                    callback: function(value) {
                                        return `₹${value}`;
                                    }
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    };

    if (loading) return <div className="text-center py-4 text-yellow-400">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-800 pt-16">
            <Navbar /> 

            <div className="p-6">
                <h1 className="text-3xl font-bold text-yellow-400 mb-6">Stock Price Charts</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {stockIds.map((id) => (
                        <div key={id} className="w-full">
                            {renderCombinedChart(id)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stockgraph;
