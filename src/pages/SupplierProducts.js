// src/pages/SupplierProducts.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SupplierProducts = () => {
  const { id } = useParams(); // supplier ID from route
  const [products, setProducts] = useState([]);
  const [supplierName, setSupplierName] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash on Delivery');
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchSupplierProducts();
  }, []);

  const fetchSupplierProducts = async () => {
    try {
      const response = await axios.get(`${API}/supplier/${id}/products`);
      setProducts(response.data.products);
      setSupplierName(response.data.supplierName);
    } catch (error) {
      console.error("Error fetching supplier products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderQuantity || isNaN(orderQuantity) || orderQuantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    try {
      await axios.post(`${API}/orders`, {
        productId: selectedProduct._id,
        quantity: orderQuantity,
        supplierId: selectedProduct.supplierId || id,
        paymentMode,
      });

      alert('Order placed successfully!');
      setShowOrderModal(false);
      setOrderQuantity('');
      setSelectedProduct(null);
      setPaymentMode('Cash on Delivery');
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('Failed to place order.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Products by {supplierName}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found for this supplier.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">Price: ₹{product.price}</p>
              <p className="text-gray-600">Quantity: {product.quantity} kg</p>
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowOrderModal(true);
                }}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Create Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Order: {selectedProduct.name}
            </h2>

            {/* Quantity Input */}
            <label className="block text-gray-700 font-medium mb-1">Enter Quantity (kg)</label>
            <input
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
              placeholder="e.g. 10"
            />

            {/* Payment Mode Selector */}
            <label className="block text-gray-700 font-medium mb-1">Select Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="UPI Payment">UPI Payment</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderQuantity('');
                  setSelectedProduct(null);
                  setPaymentMode('Cash on Delivery');
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierProducts;
