import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import logo from './logo.png'; 
import chatbotIcon from './chatt.png';
import aboutImage from './ff.png'; 
import axios from 'axios';
import './App.css'; 
import front1 from './2.png';
import Chatbot from './Chatbot';


const StockCards = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/stocks/all');
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className="flex flex-nowrap space-x-4 p-4 bg-gray-800">
      {stocks.map(stock => (
        <div key={stock.stockId} className="bg-gray-900 text-yellow-400 p-4 rounded-lg shadow-lg min-w-[220px]">
          <h2 className="text-xl font-bold mb-2">{stock.companyname}</h2>
          <p className="text-lg mb-1">Symbol: {stock.symbol}</p>
          <p className="text-lg">Price: ₹{stock.shareprice}</p>
        </div>
      ))}
    </div>
  );
};


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-yellow-400 py-6 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Trender. All rights reserved.</p>
        <p className="mt-2">Follow us on:
          <a href="#" className="text-yellow-300 hover:underline ml-2">Facebook</a>,
          <a href="#" className="text-yellow-300 hover:underline ml-2">Twitter</a>,
          <a href="#" className="text-yellow-300 hover:underline ml-2">Instagram</a>
        </p>
        <p className="mt-2">
          <a href="#" className="text-yellow-300 hover:underline">Privacy Policy</a> | 
          <a href="#" className="text-yellow-300 hover:underline ml-2">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};


const AboutUs = () => {
  return (
    <div className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center">
         
          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={aboutImage}
              alt="About Us"
              className="object-cover w-full h-full"
            />
          </div>
        
          <div className="flex-1 bg-gray-800 text-yellow-400 p-6 rounded-lg md:ml-8 mt-8 md:mt-0">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-lg">
              The share market, also known as the stock market, is a crucial part of the financial system where investors buy and sell shares of publicly traded companies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative">
  
      <nav className="bg-gray-900 text-yellow-400 p-4 fixed top-0 left-0 w-full z-20 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
        
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <Link to="/" className="text-xl font-bold hover:text-yellow-300">Trender</Link>
          </div>

       
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="#stock" className="hover:text-yellow-300">Stocks</Link>
            <Link to="#about" className="hover:text-yellow-300">About Us</Link>
            <Link to="/AdminLogin" className="hover:text-yellow-300">Admin</Link>
            <Link to="/UserLogin" className="hover:text-yellow-300">Login</Link>
          </div>

          <div className="md:hidden flex items-center ml-auto">
            <button onClick={toggleMenu} className="text-yellow-400 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>

          <div className={`md:hidden absolute top-16 right-0 w-48 bg-gray-800 text-yellow-400 rounded-lg shadow-lg ${isOpen ? 'block' : 'hidden'}`}>
            <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Home</Link>
            <Link to="#stock" className="block px-4 py-2 hover:bg-gray-700">Stocks</Link>
            <Link to="#about" className="block px-4 py-2 hover:bg-gray-700">About Us</Link>
            <Link to="/AdminLogin" className="block px-4 py-2 hover:bg-gray-700">Admin</Link>
            <Link to="/UserLogin" className="block px-4 py-2 hover:bg-gray-700">Login</Link>
          </div>
        </div>
      </nav>

    
      <div className="relative mt-16 mb-4">
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          showThumbs={false}
          showStatus={false}
          className="h-48 md:h-64 lg:h-80"
        >
          <div>
            <img src={front1} alt="Slide 1" className="object-cover w-full h-full" />
          </div>
        </Carousel>
      </div>

     
      <AboutUs />

   
      <div className="bg-gray-900 overflow-hidden">
        <div className="relative">
          <div className="whitespace-nowrap py-4 bg-gray-800">
            <div className="flex space-x-4 animate-marquee">
              <StockCards />
              <StockCards />
            </div>
          </div>
        </div>
      </div>

     
      <div className="fixed bottom-4 right-4 z-30">
        <img 
          src={chatbotIcon} 
          alt="Chatbot" 
          className="w-12 h-12 cursor-pointer" 
          onClick={toggleModal} 
        />
      </div>

     
      {isModalOpen && (
        <div className="fixed bottom-16 right-4 z-40 bg-white border border-gray-300 shadow-lg rounded-lg w-80 p-2 max-h-96 overflow-y-auto">
          <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <Chatbot />
        </div>
      )}

    
      <Footer />
    </div>
  );
};

export default Navbar;

