import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stockgraph from './Stockgraph'; 
import { useNavigate } from 'react-router-dom'; 
import { FaSignOutAlt, FaChartLine } from 'react-icons/fa'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import logo from '../src/logo.png'; 

const UserBuys = () => {
    const [buys, setBuys] = useState([]);
    const [portfolios, setPortfolios] = useState({});
    const [stocks, setStocks] = useState({});
    const [stockPrices, setStockPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPortfolio, setExpandedPortfolio] = useState(null); 

    const navigate = useNavigate(); 
   
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8080/buy/user/${userId}`)
                .then(response => {
                    const buysData = response.data;
                    setBuys(buysData);

                    const uniquePortfolioIds = [...new Set(buysData.map(buy => buy.portfolio?.portfolioId))].filter(id => id != null);
                    const uniqueStockIds = [...new Set(buysData.map(buy => buy.stock?.stockId))].filter(id => id != null);

                    if (uniquePortfolioIds.length > 0) {
                        Promise.all(uniquePortfolioIds.map(id =>
                            axios.get(`http://localhost:8080/portfolio/${id}`)
                                .then(res => ({ id, data: res.data }))
                                .catch(err => {
                                    console.error(`Error fetching portfolio ${id}:`, err);
                                    return { id, data: null };
                                })
                        ))
                        .then(portfolioResponses => {
                            const portfoliosData = portfolioResponses.reduce((acc, { id, data }) => {
                                if (data) acc[id] = data;
                                return acc;
                            }, {});
                            setPortfolios(portfoliosData);
                        })
                        .catch(err => {
                            console.error('Error fetching portfolio details:', err);
                        });
                    }

                    if (uniqueStockIds.length > 0) {
                        Promise.all(uniqueStockIds.map(id =>
                            axios.get(`http://localhost:8080/stocks/GetStockId/${id}`)
                                .then(res => ({ id, data: res.data }))
                                .catch(err => {
                                    console.error(`Error fetching stock ${id}:`, err);
                                    return { id, data: null };
                                })
                        ))
                        .then(stockResponses => {
                            const stocksData = stockResponses.reduce((acc, { id, data }) => {
                                if (data) acc[id] = data;
                                return acc;
                            }, {});
                            setStocks(stocksData);
                        })
                        .catch(err => {
                            console.error('Error fetching stock details:', err);
                        });
                    }

                    if (uniqueStockIds.length > 0) {
                        Promise.all(uniqueStockIds.map(id =>
                            axios.get(`http://localhost:8080/stockprices/stock/${id}`)
                                .then(res => ({ id, data: res.data }))
                                .catch(err => {
                                    console.error(`Error fetching stock prices for stock ${id}:`, err);
                                    return { id, data: [] };
                                })
                        ))
                        .then(stockPriceResponses => {
                            const stockPricesData = stockPriceResponses.reduce((acc, { id, data }) => {
                                if (data) acc[id] = data;
                                return acc;
                            }, {});
                            setStockPrices(stockPricesData);
                        })
                        .catch(err => {
                            console.error('Error fetching stock price details:', err);
                        });
                    }

                    setLoading(false);
                })
                .catch(err => {
                    setError('Error fetching buy details.');
                    setLoading(false);
                });
        } else {
            setError('User ID is not available.');
            setLoading(false);
        }
    }, [userId]);

    const calculateInitialPrice = (totalPrice, totalQuantity) => {
        return totalQuantity > 0 ? (totalPrice / totalQuantity).toFixed(2) : 'N/A';
    };

    const calculatePercentageChange = (initialPrice, currentPrice) => {
        if (initialPrice === 0) return 'N/A';
        const percentageChange = ((currentPrice - initialPrice) / initialPrice) * 100;
        return percentageChange > 100 ? '100%' : percentageChange.toFixed(2) + '%';
    };

    const getPriceStatus = (initialPrice, currentPrice) => {
        if (currentPrice > initialPrice) {
            return {
                status: `Profit (${calculatePercentageChange(initialPrice, currentPrice)})`,
                color: 'text-green-500',
                trendSymbol: '▲'
            };
        } else if (currentPrice < initialPrice) {
            return {
                status: `Loss (${calculatePercentageChange(initialPrice, currentPrice)})`,
                color: 'text-red-500',
                trendSymbol: '▼'
            };
        }
        return {
            status: `No Change (${calculatePercentageChange(initialPrice, currentPrice)})`,
            color: 'text-blue-500',
            trendSymbol: '—'
        };
    };

    const aggregateBuysByPortfolio = () => {
        return buys.reduce((acc, buy) => {
            if (buy.portfolio) {
                const { portfolioId } = buy.portfolio;
                if (!acc[portfolioId]) {
                    acc[portfolioId] = {
                        totalQuantity: 0,
                        totalPrice: 0,
                        portfolioName: portfolios[portfolioId]?.portfolioname || 'N/A',
                        stocks: {},
                    };
                }
                acc[portfolioId].totalQuantity += buy.quantity;
                acc[portfolioId].totalPrice += buy.totalPrice;

                if (buy.stock) {
                    const { stockId } = buy.stock;
                    if (!acc[portfolioId].stocks[stockId]) {
                        acc[portfolioId].stocks[stockId] = {
                            symbol: buy.stock.symbol,
                            companyname: stocks[stockId]?.companyname || 'N/A',
                            initialPrice: calculateInitialPrice(buy.totalPrice, buy.quantity),
                            currentPrice: stockPrices[stockId]?.[0]?.changePrice || 0,
                        };
                    }
                }
            }
            return acc;
        }, {});
    };

    const aggregatedBuys = aggregateBuysByPortfolio();

    const handleViewMoreClick = (portfolioId) => {
        setExpandedPortfolio(prevId => (prevId === portfolioId ? null : portfolioId));
    };

    const handleIconClick = () => {
        navigate('/Stockgraph'); 
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
                            <FaSignOutAlt className="mr-2 text-xl" /> Go Back
                        </button>
                    </div>
                </div>
            </nav>
        );
    };

    if (loading) return <div className="text-center py-4 text-yellow-400">Loading...</div>;
    if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

    return (
        <div className="relative min-h-screen bg-gray-800">
            <Navbar /> 

         
            <div className="absolute top-16 right-4 cursor-pointer hover:text-yellow-300 transition-colors" onClick={handleIconClick}>
                <FaChartLine className="text-3xl text-yellow-400" />
            </div>

            <div className="pt-16 p-6">
                <h1 className="text-2xl font-bold text-yellow-400 mb-4">Your Purchase</h1>
                {Object.keys(aggregatedBuys).length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {Object.entries(aggregatedBuys).map(([portfolioId, data]) => {
                            const { portfolioName, totalPrice, totalQuantity, stocks } = data;
                            const firstStock = Object.values(stocks)[0] || {}; 
                            const initialPrice = calculateInitialPrice(totalPrice, totalQuantity);
                            const currentPrice = firstStock.currentPrice || 0;
                            const { status, color, trendSymbol } = getPriceStatus(initialPrice, currentPrice);

                            return (
                                <div key={portfolioId} className="bg-gray-600 text-yellow-400 p-4 rounded-lg shadow-md w-full sm:w-80 hover:bg-gray-700 transition-colors">
                                    <h2 className="text-xl font-semibold">{portfolioName}</h2>
                                    <p>Total Quantity: {totalQuantity}</p>
                                    <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
                                    <div className="flex items-center mt-2">
                                        <p className={`text-lg ${color} mr-2`}>{status}</p>
                                        <span className={`${color}`}>{trendSymbol}</span>
                                    </div>
                                    <button
                                        onClick={() => handleViewMoreClick(portfolioId)}
                                        className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors"
                                    >
                                        {expandedPortfolio === portfolioId ? 'View Less' : 'View More'}
                                    </button>
                                    {expandedPortfolio === portfolioId && (
                                        <div className="mt-4">
                                            {Object.entries(stocks).map(([stockId, stockData]) => (
                                                <div key={stockId} className="mt-2">
                                                    <h3 className="text-lg font-semibold">{stockData.symbol} - {stockData.companyname}</h3>
                                                    <p>Initial Price: ₹{stockData.initialPrice}</p>
                                                    <p>Current Price: ₹{stockData.currentPrice}</p>
                                                    <p className={`text-lg ${getPriceStatus(stockData.initialPrice, stockData.currentPrice).color}`}>
                                                        {getPriceStatus(stockData.initialPrice, stockData.currentPrice).status} {getPriceStatus(stockData.initialPrice, stockData.currentPrice).trendSymbol}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-yellow-400 mt-4">No data available</div>
                )}
            </div>
        </div>
    );
};

export default UserBuys;
