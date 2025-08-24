
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Utility functions for localStorage management
const CartManager = {
  getCart: () => {
    const cart = localStorage.getItem('cartItems');
    return cart ? JSON.parse(cart) : [];
  },
  
  addToCart: (product, quantity = 1) => {
    const cart = CartManager.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cart));
    return cart;
  },
  
  removeFromCart: (productId) => {
    const cart = CartManager.getCart().filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    return cart;
  },
  
  updateQuantity: (productId, quantity) => {
    const cart = CartManager.getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return CartManager.removeFromCart(productId);
      }
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    return cart;
  },
  
  clearCart: () => {
    localStorage.removeItem('cartItems');
    return [];
  },
  
  getCartTotal: () => {
    return CartManager.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartItemCount: () => {
    return CartManager.getCart().reduce((total, item) => total + item.quantity, 0);
  }
};

// Enhanced Navbar Component
function StoreNavbar() {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCartCount(CartManager.getCartItemCount());
    
    // Listen for cart updates
    const handleStorageChange = () => {
      setCartCount(CartManager.getCartItemCount());
    };
    
    window.addEventListener('cartUpdated', handleStorageChange);
    return () => window.removeEventListener('cartUpdated', handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            My Store
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="text-gray-600 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
