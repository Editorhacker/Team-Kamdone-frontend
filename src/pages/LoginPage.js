import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`; // e.g., http://localhost:5000/api

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'vendor'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Fixed: removed duplicate `/api`
      const response = await axios.post(`${API}/auth/login`, formData);

      login(response.data.user, response.data.access_token);

      if (response.data.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/supplier/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">🌾</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Bulk Buy Buddy</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="vendor"
                      checked={formData.role === 'vendor'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mr-2 text-green-600"
                    />
                    <span className="text-gray-700">Vendor</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="supplier"
                      checked={formData.role === 'supplier'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mr-2 text-green-600"
                    />
                    <span className="text-gray-700">Supplier</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.role === 'vendor' ? 'Phone Number' : 'Email or Phone'}
                </label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder={formData.role === 'vendor' ? 'Enter your phone number' : 'Enter email or phone'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
