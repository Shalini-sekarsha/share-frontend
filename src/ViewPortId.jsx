import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PORTFOLIO_DETAILS_URL = 'http://localhost:8080/portfolio/user'; 
const BUY_DETAILS_URL = 'http://localhost:8080/buy/portfolio'; 

const ViewPortId = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [buyDetails, setBuyDetails] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchPortfoliosData = async () => {
            setLoading(true);
            try {
                const userId = sessionStorage.getItem('userId');
                
                if (!userId) {
                    throw new Error('User ID not found in session storage.');
                }

                const response = await axios.get(`${PORTFOLIO_DETAILS_URL}/${userId}`);
                setPortfolios(response.data);
            } catch (error) {
                console.error('Error fetching portfolios data:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data : 'There was an error fetching portfolios data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfoliosData();
    }, []);

    const handleViewMore = async (portfolioId) => {
        try {
            
            const response = await axios.post(BUY_DETAILS_URL, { portfolioId });
            setBuyDetails(response.data);
            setSelectedPortfolio(portfolioId); 
                        navigate(`/PortfolioDetail/${portfolioId}`); 
        } catch (error) {
            console.error('Error fetching buy details:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : 'There was an error fetching buy details.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Portfolios Details</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {portfolios.length > 0 ? (
                portfolios.map(portfolio => (
                    <div key={portfolio.portfolioId} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
                        <h3 className="text-xl font-semibold mb-2">Portfolio ID: {portfolio.portfolioId}</h3>
                        <p className="text-gray-600">Portfolio Name: {portfolio.portfolioname}</p>
                        <p className="text-gray-600">User ID: {portfolio.user.userId}</p>

                        {portfolio.stocks && portfolio.stocks.length > 0 ? (
                            <table className="min-w-full bg-white border border-gray-200 mt-4">
                                <thead>
                                    <tr>
                                        <th className="border-b px-4 py-2">Stock ID</th>
                                        <th className="border-b px-4 py-2">Company Name</th>
                                        <th className="border-b px-4 py-2">Change Price</th>
                                        <th className="border-b px-4 py-2">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.stocks.map(stock => (
                                        <tr key={stock.stockId}>
                                            <td className="border-b px-4 py-2">{stock.stockId}</td>
                                            <td className="border-b px-4 py-2">{stock.companyname}</td>
                                            <td className="border-b px-4 py-2">{stock.changePrice}</td>
                                            <td className="border-b px-4 py-2">{stock.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No stocks in this portfolio.</p>
                        )}

                      
                        <button
                            onClick={() => handleViewMore(portfolio.portfolioId)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            View More
                        </button>
                    </div>
                ))
            ) : (
                !loading && <p>No portfolios found.</p>
            )}
        </div>
    );
};

export default ViewPortId;
