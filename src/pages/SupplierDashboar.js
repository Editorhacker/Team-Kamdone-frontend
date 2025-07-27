import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddProductModal from '../components/AddProductModal';
import CreateBulkOrderModal from '../components/CreateBulkOrderModal';
import { useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const [productList, setProductList] = useState([]);
  const [bulkOrders, setBulkOrders] = useState([]);

  const [product, setProduct] = useState({ name: '', quantity: '', price: '' });
  const [bulkOrder, setBulkOrder] = useState({ productName: '', quantity: 50, price: '' });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [isEditBulkMode, setIsEditBulkMode] = useState(false);
  const [editBulkOrderId, setEditBulkOrderId] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api/products`;
  const BULK_API = `${BACKEND_URL}/api/bulk-orders`;

  useEffect(() => {
    fetchProducts();
    fetchBulkOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      const allProducts = res.data;
      const myProducts = allProducts.filter(p => p.supplierId === user._id);
      setProductList(myProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchBulkOrders = async () => {
    try {
      const res = await axios.get(`${BULK_API}/${user._id}`);
      setBulkOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch bulk orders:', err);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleBulkChange = (e) => {
    setBulkOrder({ ...bulkOrder, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && editProductId) {
        await axios.put(`${API}/${editProductId}`, product);
      } else {
        await axios.post(API, {
          ...product,
          supplierId: user._id,
        });
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleCreateBulkOrder = async () => {
    if (bulkOrder.quantity < 50) {
      alert("Minimum quantity must be 50 kg.");
      return;
    }
    try {
      if (isEditBulkMode && editBulkOrderId) {
        await axios.put(`${BULK_API}/${editBulkOrderId}`, bulkOrder);
        alert('✅ Bulk order updated successfully!');
      } else {
        await axios.post(BULK_API, {
          ...bulkOrder,
          supplierId: user._id,
        });
        alert('✅ Bulk order created successfully!');
      }
      fetchBulkOrders();
      setShowBulkModal(false);
      setIsEditBulkMode(false);
      setEditBulkOrderId(null);
      setBulkOrder({ productName: '', quantity: 50, price: '' });
    } catch (err) {
      console.error('Failed to create/update bulk order:', err);
      alert('❌ Failed to process bulk order.');
    }
  };

  const handleEdit = (prod) => {
    setProduct({ name: prod.name, quantity: prod.quantity, price: prod.price });
    setEditProductId(prod._id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleEditBulk = (order) => {
    setBulkOrder({
      productName: order.productName,
      quantity: order.quantity,
      price: order.price,
    });
    setIsEditBulkMode(true);
    setEditBulkOrderId(order._id);
    setShowBulkModal(true);
  };

  const handleDeleteBulk = async (id) => {
    if (window.confirm('Are you sure you want to delete this bulk order?')) {
      try {
        await axios.delete(`${BULK_API}/${id}`);
        fetchBulkOrders();
      } catch (err) {
        console.error('Failed to delete bulk order:', err);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditProductId(null);
    setProduct({ name: '', quantity: '', price: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-lg">🌾</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Bulk Buy Buddy</h1>
            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
              Supplier
            </span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-700 font-medium">
              Welcome, <span className="font-semibold">{user?.business_name}</span>
            </p>
            <button
              onClick={logout}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => {
                setShowModal(true);
                setProduct({ name: '', quantity: '', price: '' });
                setIsEditMode(false);
                setEditProductId(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md transition"
            >
              + Add Product
            </button>

            <button
              onClick={() => navigate('/my-orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
            >
              📦 My Orders
            </button>

            <button
              onClick={() => {
                setShowBulkModal(true);
                setIsEditBulkMode(false);
                setEditBulkOrderId(null);
                setBulkOrder({ productName: '', quantity: 50, price: '' });
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-md transition flex items-center gap-2"
            >
              🏷️ Create Bulk Order
            </button>
          </div>

          {/* Product List */}
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Your Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((prod) => (
              <div key={prod._id} className="bg-white border shadow-sm rounded-xl p-5 space-y-2 relative">
                <h4 className="text-lg font-semibold text-gray-800">{prod.name}</h4>
                <p className="text-sm text-gray-600">Quantity: {prod.quantity} kg</p>
                <p className="text-sm text-gray-600">Price: ₹{prod.price}/kg</p>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Available</span>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Orders */}
          <h3 className="text-2xl font-bold text-gray-700 mb-4 mt-12">Your Bulk Orders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulkOrders.length === 0 ? (
              <p className="text-gray-500">No bulk orders yet.</p>
            ) : (
              bulkOrders.map((order) => (
                <div key={order._id} className="bg-white border shadow-sm rounded-xl p-5 space-y-2">
                  <h4 className="text-lg font-semibold text-gray-800">{order.productName}</h4>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity} kg</p>
                  <p className="text-sm text-gray-600">Price: ₹{order.price}/kg</p>
                  <p className="text-xs text-gray-400">Created: {new Date(order.createdAt).toLocaleString()}</p>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Bulk Order</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleEditBulk(order)}
                      className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBulk(order._id)}
                      className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Product Modal */}
      {showModal && (
        <AddProductModal
          product={product}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          isEditMode={isEditMode}
        />
      )}
      {/* Bulk Order Modal */}
      {showBulkModal && (
        <CreateBulkOrderModal
          bulkOrder={bulkOrder}
          handleBulkChange={handleBulkChange}
          handleCreateBulkOrder={handleCreateBulkOrder}
          closeModal={() => {
            setShowBulkModal(false);
            setIsEditBulkMode(false);
            setEditBulkOrderId(null);
            setBulkOrder({ productName: '', quantity: 50, price: '' });
          }}
          isEditMode={isEditBulkMode}
        />
      )}
    </div>
  );
};

export default SupplierDashboard;
