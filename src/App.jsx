import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        
        <main style={{ minHeight: '60vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
