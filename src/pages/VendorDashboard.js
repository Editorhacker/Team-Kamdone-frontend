import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VendorDashboard = () => {
    const { user, getAuthHeaders, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pincode, setPincode] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [searchMessage, setSearchMessage] = useState('');
    const [bulkOrders, setBulkOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
        fetchBulkOrders();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API}/vendor/dashboard`, {
                headers: getAuthHeaders()
            });
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBulkOrders = async () => {
        try {
            const response = await axios.get(`${API}/bulk-orders`, {
                headers: getAuthHeaders()
            });
            setBulkOrders(response.data);
        } catch (error) {
            console.error('Error fetching bulk orders:', error);
        }
    };

    const handleSearch = async () => {
        try {
            setSearchMessage('');
            const response = await axios.get(`${API}/suppliers/search?pincode=${pincode}`, {
                headers: getAuthHeaders()
            });
            if (response.data.length > 0) {
                setSuppliers(response.data);
            } else {
                setSuppliers([]);
                setSearchMessage('No suppliers found for this pincode.');
            }
        } catch (error) {
            console.error('Error searching suppliers:', error);
            setSuppliers([]);
            setSearchMessage('An error occurred while searching.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">🌾</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">Bulk Buy Buddy</span>
                            </div>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Vendor
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {user?.name}!</span>
                            <button
                                onClick={logout}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                {/* Dashboard and Search Suppliers */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600 mb-6">Welcome back, {dashboardData?.vendorName}!</p>

                    <h2 className="text-xl font-bold mb-4">Search Suppliers by Pincode</h2>
                    <div className="flex space-x-4 mb-4">
                        <input
                            type="text"
                            placeholder="Enter pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Search
                        </button>
                    </div>

                    {searchMessage && <p className="text-red-600 mb-4">{searchMessage}</p>}

                    {suppliers.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {suppliers.map((supplier) => (
                                <div
                                    key={supplier._id}
                                    className="flex justify-between items-center border p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                            {supplier.name}
                                        </h3>
                                        <p className="text-base text-gray-700 mb-1">
                                            <span className="font-medium">Business:</span> {supplier.business_name}
                                        </p>
                                        <p className="text-base text-gray-700 mb-1">
                                            <span className="font-medium">Email:</span> {supplier.email}
                                        </p>
                                        <p className="text-base text-gray-700">
                                            <span className="font-medium">Phone:</span> {supplier.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => navigate(`/supplier/${supplier._id}/products`)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            View Products
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bulk Orders Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-10">
                    <h2 className="text-2xl font-bold mb-4">Available Bulk Orders</h2>

                    {bulkOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bulkOrders.map((order) => (
    <div key={order._id} className="border p-6 rounded-xl shadow hover:shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {order.productName}
        </h3>
        <p className="text-gray-700 mb-1">
            <span className="font-medium">Quantity:</span> {order.quantity} kg
        </p>
        <p className="text-gray-700 mb-1">
            <span className="font-medium">Price per kg:</span> ₹{order.price}
        </p>
        <p className="text-gray-700 mb-1">
            <span className="font-medium">Supplier:</span>{' '}
            {order.supplierName || 'Unknown'}
        </p>
        <p className="text-gray-700 mb-4">
            <span className="font-medium">Pincode:</span>{' '}
            {order.pincode || 'Not available'}
        </p>
        <button
            onClick={() => alert('You have joined the bulk order!')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
            Join Bulk
        </button>
    </div>
))}

                        </div>
                    ) : (
                        <p className="text-gray-600">No active bulk orders available.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VendorDashboard;
