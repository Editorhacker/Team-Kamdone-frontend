import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'vendor');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    business_name: '',
    email: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
const [phoneError, setPhoneError] = useState('');
const [passwordError, setPasswordError] = useState('');

    const isPhoneValid = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     setError('');
  setPhoneError('');
  setPasswordError('');

        if (!isPhoneValid(formData.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // ✅ Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
      );
      setLoading(false);
      return;
    }

    try {
      const endpoint = role === 'vendor' ? '/auth/vendor/signup' : '/auth/supplier/signup';
      const response = await axios.post(`${API}${endpoint}`, formData);
      login(response.data.user, response.data.access_token);

      if (response.data.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/supplier/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Signup failed');
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Bulk Buy Buddy</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="vendor"
                  checked={role === 'vendor'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 text-green-600"
                />
                <span className="text-gray-700">Vendor</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="supplier"
                  checked={role === 'supplier'}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 text-green-600"
                />
                <span className="text-gray-700">Supplier</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {role === 'vendor' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                    const phone = e.target.value;
                    setFormData({ ...formData, phone });
                    if (!/^\d{10}$/.test(phone)) {
                        setPhoneError('Phone number must be exactly 10 digits.');
                    } else {
                        setPhoneError('');
                    }
                    }}
                    maxLength="10"
                    className={`w-full px-4 py-3 border ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500`}
                    placeholder="Enter your 10-digit phone number"
                    required
                />
                {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                </div>


               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setPasswordError(''); // clear live on input
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Create a secure password"
                    required
                />
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                    const phone = e.target.value;
                    setFormData({ ...formData, phone });
                    if (!/^\d{10}$/.test(phone)) {
                        setPhoneError('Phone number must be exactly 10 digits.');
                    } else {
                        setPhoneError('');
                    }
                    }}
                    maxLength="10"
                    className={`w-full px-4 py-3 border ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500`}
                    placeholder="Enter your 10-digit phone number"
                    required
                />
                {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode / Place</label>
                <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Enter your Pincode / Place"
                    required
                />
                </div>


                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setPasswordError(''); // clear live on input
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Create a secure password"
                    required
                />
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                </div>


              </div>
            )}

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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
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

export default SignupPage;
