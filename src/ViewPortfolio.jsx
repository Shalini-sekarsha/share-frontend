// import React, { useState, useEffect } from 'react'; 
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaSignOutAlt } from 'react-icons/fa';
// import logo from '../src/logo.png'; 

// const ViewPortfolio = () => {
//     const [portfolios, setPortfolios] = useState([]);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);
//     const [purchaseDetails, setPurchaseDetails] = useState({});
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchPortfolios = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/portfolio/all');
//                 setPortfolios(response.data);
//                 sessionStorage.setItem('portfolios', JSON.stringify(response.data));
//             } catch (error) {
//                 console.error('Error fetching portfolios:', error);
//                 setError('There was an error fetching the portfolios.');
//             }
//         };

//         fetchPortfolios();
//     }, []);

//     useEffect(() => {
//         const storedDetails = localStorage.getItem('purchaseDetails');
//         if (storedDetails) {
//             const parsedDetails = JSON.parse(storedDetails);
//             const detailsByPortfolio = parsedDetails.reduce((acc, detail) => {
//                 if (!acc[detail.portfolioId]) {
//                     acc[detail.portfolioId] = [];
//                 }
//                 acc[detail.portfolioId].push(detail);
//                 return acc;
//             }, {});
//             setPurchaseDetails(detailsByPortfolio);
//         }
//     }, []);

//     const handleAddPortfolio = () => {
//         navigate('/AddPortfolio');
//     };

//     const handleAddStock = (portfolioId) => {
//         const selectedPortfolio = portfolios.find(p => p.portfolioId === portfolioId);
//         if (selectedPortfolio) {
//             sessionStorage.setItem('selectedPortfolio', JSON.stringify(selectedPortfolio));
//             navigate('/ViewStock');
//         }
//     };


//     const showSuccessAlert = (message) => {
//         setSuccessMessage(message);
//         setTimeout(() => {
//             setSuccessMessage(null);
//         }, 5000); 
//     };

    
//     const Navbar = () => {
//         const handleLogout = () => {
           
//             navigate('/UserDashboard');
//             console.log('Logging out');
//         };

//         return (
//             <nav className="bg-gray-900 text-yellow-500 p-4 fixed top-0 left-0 w-full z-10 shadow-md">
//                 <div className="container mx-auto flex items-center justify-between">
                
//                     <div className="flex items-center space-x-2">
//                         <img src={logo} alt="Logo" className="w-8 h-8" />
//                         <span className="text-xl font-bold">Trender</span>
//                     </div>

                   
//                     <div className="flex space-x-6">
//                         <button onClick={handleLogout} className="hover:text-yellow-300 flex items-center">
//                             <FaSignOutAlt className="mr-2 text-xl" /> GoBack
//                         </button>
//                     </div>
//                 </div>
//             </nav>
//         );
//     };

//     return (
//         <div className="flex flex-col min-h-screen bg-gray-800">
//             <Navbar /> 

//             <div className="pt-16 p-6 max-w-6xl mx-auto">
              
//                 {successMessage && (
//                     <div className="mb-6 w-full bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md shadow-lg p-4">
//                         {successMessage}
//                     </div>
//                 )}

               
//                 {error && (
//                     <div className="mb-6 w-full bg-red-100 text-red-800 border border-red-300 rounded-md shadow-lg p-4">
//                         {error}
//                     </div>
//                 )}

//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-semibold text-yellow-400">Portfolios</h2>
//                     <button
//                         onClick={handleAddPortfolio}
//                         className="bg-yellow-500 text-white rounded-full p-3 hover:bg-yellow-400 transition transform hover:scale-105"
//                         aria-label="Add Portfolio"
//                     >
//                         Add+
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {portfolios.map(portfolio => (
//                         <div
//                             key={portfolio.portfolioId}
//                             className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-600 transition-transform transform hover:scale-105 hover:shadow-xl"
//                             style={{ height: 'auto' }}
//                         >
//                             <div className="p-5 flex flex-col h-full">
//                                 <h3 className="text-2xl font-semibold text-yellow-400">{portfolio.portfolioname}</h3>
//                                 <button
//                                     onClick={() => handleAddStock(portfolio.portfolioId)}
//                                     className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-400 transition transform hover:scale-105"
//                                     aria-label={`Add stock to ${portfolio.portfolioname}`}
//                                 >
//                                     Add Stock
//                                 </button>
//                                 {purchaseDetails[portfolio.portfolioId] && purchaseDetails[portfolio.portfolioId].length > 0 && (
//                                     <div className="mt-4 bg-gray-700 p-4 border border-gray-600 rounded flex-grow">
//                                         <h4 className="text-lg font-semibold text-gray-100 mb-2">Purchase Details</h4>
//                                         {purchaseDetails[portfolio.portfolioId].map((detail, index) => (
//                                             <div key={index} className="mb-4 text-gray-300">
//                                                 <p><strong>Company Name:</strong> {detail.companyName}</p>
//                                                 <p><strong>Symbol:</strong> {detail.symbol}</p>
//                                                 <p><strong>Latest Price:</strong> ₹{detail.changePrice}</p>
//                                                 <p><strong>Quantity:</strong> {detail.quantity}</p>
//                                                 <p><strong>Total Price:</strong> ₹{detail.totalPrice}</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// };

// export default ViewPortfolio;
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../src/logo.png'; 

const ViewPortfolio = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [purchaseDetails, setPurchaseDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await axios.get('http://localhost:8080/portfolio/all');
                setPortfolios(response.data);
                sessionStorage.setItem('portfolios', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching portfolios:', error);
                setError('There was an error fetching the portfolios.');
            }
        };

        fetchPortfolios();
    }, []);

    useEffect(() => {
        const storedDetails = localStorage.getItem('purchaseDetails');
        if (storedDetails) {
            const parsedDetails = JSON.parse(storedDetails);
            const detailsByPortfolio = parsedDetails.reduce((acc, detail) => {
                if (!acc[detail.portfolioId]) {
                    acc[detail.portfolioId] = [];
                }
                acc[detail.portfolioId].push(detail);
                return acc;
            }, {});
            setPurchaseDetails(detailsByPortfolio);
        }
    }, []);

    const handleAddPortfolio = () => {
        navigate('/AddPortfolio');
    };

    const handleAddStock = (portfolioId) => {
        const selectedPortfolio = portfolios.find(p => p.portfolioId === portfolioId);
        if (selectedPortfolio) {
            sessionStorage.setItem('selectedPortfolio', JSON.stringify(selectedPortfolio));
            navigate('/ViewStock');
        }
    };

    const showSuccessAlert = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 5000); 
    };

    const Navbar = () => {
        const handleLogout = () => {
            navigate('/UserDashboard');
            console.log('Logging out');
        };

        return (
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
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-800">
            <Navbar /> 

            <div className="pt-16 p-6 max-w-6xl mx-auto relative">
                {successMessage && (
                    <div className="mb-6 w-full bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md shadow-lg p-4">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="mb-6 w-full bg-red-100 text-red-800 border border-red-300 rounded-md shadow-lg p-4">
                        {error}
                    </div>
                )}
                
                <div className="relative">
                    <button
                        onClick={handleAddPortfolio}
                        className="absolute top-0 right-0 mt-4 mr-4 bg-yellow-500 text-white rounded-full p-3 hover:bg-yellow-400 transition transform hover:scale-105"
                        aria-label="Add Portfolio"
                    >
                        Add+
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                    {portfolios.map(portfolio => (
                        <div
                            key={portfolio.portfolioId}
                            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-600 transition-transform transform hover:scale-105 hover:shadow-xl"
                            style={{ height: 'auto' }}
                        >
                            <div className="p-5 flex flex-col h-full">
                                <h3 className="text-2xl font-semibold text-yellow-400">{portfolio.portfolioname}</h3>
                                <button
                                    onClick={() => handleAddStock(portfolio.portfolioId)}
                                    className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-400 transition transform hover:scale-105"
                                    aria-label={`Add stock to ${portfolio.portfolioname}`}
                                >
                                    Add Stock
                                </button>
                                {purchaseDetails[portfolio.portfolioId] && purchaseDetails[portfolio.portfolioId].length > 0 && (
                                    <div className="mt-4 bg-gray-700 p-4 border border-gray-600 rounded flex-grow">
                                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Purchase Details</h4>
                                        {purchaseDetails[portfolio.portfolioId].map((detail, index) => (
                                            <div key={index} className="mb-4 text-gray-300">
                                                <p><strong>Company Name:</strong> {detail.companyName}</p>
                                                <p><strong>Symbol:</strong> {detail.symbol}</p>
                                                <p><strong>Latest Price:</strong> ₹{detail.changePrice}</p>
                                                <p><strong>Quantity:</strong> {detail.quantity}</p>
                                                <p><strong>Total Price:</strong> ₹{detail.totalPrice}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ViewPortfolio

