import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = (role) => {
    navigate(`/signup?role=${role}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🌾</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Bulk Buy Buddy</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogin}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </button>
            <button 
              onClick={() => handleGetStarted('vendor')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Empowering Street Food Vendors with{' '}
                <span className="text-green-600">Smart Sourcing</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of vendors who save money and time by purchasing raw materials together. 
                Get wholesale prices, trusted suppliers, and focus on what you do best - cooking amazing food.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button 
                onClick={() => handleGetStarted('vendor')}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-200"
              >
                I'm a Vendor
              </button>
              <button 
                onClick={() => handleGetStarted('supplier')}
                className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition duration-200"
              >
                I'm a Supplier
              </button>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-3xl p-8 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1737743824207-6ac1f4ba47f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxzdHJlZXQlMjBmb29kJTIwdmVuZG9yc3xlbnwwfHx8fDE3NTM1NDQyMzl8MA&ixlib=rb-4.1.0&q=85"
                alt="Street food vendors working together"
                className="w-full h-80 object-cover rounded-2xl shadow-md"
              />
              
              {/* Decorative vegetables overlay */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🥕</span>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🥬</span>
              </div>
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🍅</span>
              </div>
              <div className="absolute bottom-1/4 -right-6 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🧄</span>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* About Us & Why Us */}
<div className="max-w-7xl mx-auto px-6 py-20">
  <div className="grid md:grid-cols-2 gap-12">
    {/* About Us */}
    <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 border border-gray-100">
      <h2 className="text-4xl font-extrabold text-gray-900">About Us</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        <span className="font-semibold text-green-600">Bulk Buy Buddy</span> is a digital platform crafted to connect local <span className="font-medium">street food vendors</span> with verified suppliers. We simplify and streamline bulk raw material purchasing, ensuring affordability, reliability, and community collaboration. Our mission is to empower small businesses and food entrepreneurs with tools and networks that help them thrive.
      </p>
    </div>

    {/* Why Us */}
    <div className="bg-white rounded-3xl shadow-xl p-10 space-y-6 border border-gray-100">
      <h2 className="text-4xl font-extrabold text-gray-900">Why Choose Us?</h2>
      <ul className="space-y-4 text-gray-700 text-lg leading-relaxed">
        <li className="flex items-start space-x-3">
          <span className="text-green-600 text-xl mt-1">💰</span>
          <span><strong>Save More:</strong> Get wholesale rates by joining vendor groups.</span>
        </li>
        <li className="flex items-start space-x-3">
          <span className="text-green-600 text-xl mt-1">✅</span>
          <span><strong>Verified Suppliers:</strong> Only trusted and rated suppliers are listed.</span>
        </li>
        <li className="flex items-start space-x-3">
          <span className="text-green-600 text-xl mt-1">🛒</span>
          <span><strong>Seamless Ordering:</strong> Simple bulk ordering in just a few clicks.</span>
        </li>
        <li className="flex items-start space-x-3">
          <span className="text-green-600 text-xl mt-1">🤝</span>
          <span><strong>Community Support:</strong> Collaborate, grow, and learn with others.</span>
        </li>
        <li className="flex items-start space-x-3">
          <span className="text-green-600 text-xl mt-1">📦</span>
          <span><strong>Full Transparency:</strong> Real-time tracking, pricing, and messaging.</span>
        </li>
      </ul>
    </div>
  </div>
</div>

    </div>
  );
};

export default HomePage;
