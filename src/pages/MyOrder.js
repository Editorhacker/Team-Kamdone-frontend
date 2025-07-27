import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'supplier' && user._id) {
      fetchOrders(user._id);
    } else {
      setError('Only suppliers can view orders.');
      setFetching(false);
    }
    // eslint-disable-next-line
  }, [user, loading]);

  const fetchOrders = async (supplierId) => {
    try {
      setFetching(true);
      const res = await axios.get(`${BACKEND_URL}/api/orders/supplier/${supplierId}`);
      setOrders(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">My Orders</h2>

        {fetching ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-sm rounded-xl p-5 border"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  Product: {order.productId?.name || 'N/A'}
                </h4>
                <p className="text-gray-600">Quantity: {order.quantity} kg</p>
                <p className="text-gray-600">Payment Mode: {order.paymentMode}</p>
                <p className="text-sm text-gray-400">
                  Ordered On: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
