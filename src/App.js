import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VendorDashboard from './pages/VendorDashboard';
import SupplierDashboard from './pages/SupplierDashboar';
import SupplierProducts from './pages/SupplierProducts';
import MyOrders from "./pages/MyOrder";


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect based on user role
    if (user.role === 'vendor') {
      return <Navigate to="/vendor/dashboard" />;
    } else if (user.role === 'supplier') {
      return <Navigate to="/supplier/dashboard" />;
    }
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } 
      />

      {/* Protected Vendor Routes */}
      <Route 
        path="/vendor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Protected Supplier Routes */}
      <Route 
        path="/supplier/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierDashboard />
          </ProtectedRoute>
        } 
      />

      <Route path="/supplier/:id/products" element={<SupplierProducts />} />
      
        <Route path="/my-orders" element={<MyOrders />} />


      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;