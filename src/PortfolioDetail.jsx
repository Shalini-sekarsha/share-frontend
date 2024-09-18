import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PORTFOLIO_BUYS_URL = 'http://localhost:8080/buy/portfolio'; // Base URL for fetching buy details

const PortfolioDetail = () => {
    const [buyDetails, setBuyDetails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBuyDetails = async () => {
            setLoading(true);
            try {
               
                const portfolioId = sessionStorage.getItem('portfolioId');
                
                
                if (!portfolioId) {
                    setError('No portfolio ID found in session storage.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${PORTFOLIO_BUYS_URL}/${portfolioId}`);
                setBuyDetails(response.data);
            } catch (error) {
                console.error('Error fetching buy details:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data : 'There was an error fetching buy details.');
            } finally {
                setLoading(false);
            }
        };

        fetchBuyDetails();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Portfolio Detail</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {buyDetails.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 mt-4">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">Buy ID</th>
                            <th className="border-b px-4 py-2">Stock ID</th>
                            <th className="border-b px-4 py-2">Quantity</th>
                            <th className="border-b px-4 py-2">Change Price</th>
                            <th className="border-b px-4 py-2">Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyDetails.map(buy => (
                            <tr key={buy.id}>
                                <td className="border-b px-4 py-2">{buy.id}</td>
                                <td className="border-b px-4 py-2">{buy.stock.stockId}</td>
                                <td className="border-b px-4 py-2">{buy.quantity}</td>
                                <td className="border-b px-4 py-2">{buy.changePrice}</td>
                                <td className="border-b px-4 py-2">{buy.totalPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No buy details found.</p>
            )}
        </div>
    );
};

export default PortfolioDetail;
