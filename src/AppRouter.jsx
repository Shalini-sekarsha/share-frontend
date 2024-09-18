import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import AdminLogin from "./AdminLogin";
import UserLogin from "./UserLogin";
import RegisterForm from "./RegisterForm";
import AdminDashboard from "./AdminDashboard";

import Stocks from "./Stocks";
import StockPrices from "./StockPrices";
import UserDashboard from "./UserDashboard";
import AddPortfolio from "./AddPortfolio";
import ViewPortfolio from "./ViewPortfolio";
import AddStock from "./AddStock";
import ViewStock from "./ViewStock";
import StockDetails from "./StockDetails";
import ViewPortId from "./ViewPortId";
import PortfolioDetail from "./PortfolioDetail";
import UserBuys from "./UserBuys";

import Chatbot from "./Chatbot";
import Stockgraph from "./Stockgraph";
function AppRouter() {
    return (
       
        <Router>
            <Routes>
             
               <Route path="/" element={<Navbar/>}/> 
               <Route path="/AdminLogin" element={<AdminLogin/>}/>
               <Route path="/UserLogin" element={<UserLogin/>}/>  
               <Route path="/RegisterForm" element={<RegisterForm/>}/>  
               <Route path="/AdminDashboard" element={<AdminDashboard/>}/>  
               
               <Route path="/Stocks" element={<Stocks/>}/>  
               <Route path="/StockPrices" element={<StockPrices/>}/>
                <Route path="/UserDashboard" element={<UserDashboard/>}/>
                <Route path="/AddPortfolio" element={<AddPortfolio/>}/>
                <Route path="/ViewPortfolio" element={<ViewPortfolio/>}/>
                <Route path="/AddStock" element={<AddStock/>}/>
                <Route path="/ViewStock" element={<ViewStock/>}/>
                <Route path="/StockDetails" element={<StockDetails/>}/>
               
                <Route path="/ViewPortId" element={<ViewPortId/>}/>
                <Route path="/PortfolioDetail" element={<PortfolioDetail/>}/>

                <Route path="/UserBuys" element={<UserBuys/>}/>
               
                <Route path="/Chatbot" element={<Chatbot/>}/>
                <Route path="/Stockgraph" element={<Stockgraph/>}/>




            

            </Routes>
        </Router>
      
    );
}
export default AppRouter;