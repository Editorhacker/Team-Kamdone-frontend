// src/components/CreateBulkOrderModal.js
import React from 'react';

const CreateBulkOrderModal = ({ bulkOrder, handleBulkChange, handleCreateBulkOrder, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-md p-6 w-96 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Create Bulk Order</h3>

        <input
          type="text"
          name="supplierName"
          placeholder="Supplier Name"
          value={bulkOrder.supplierName}
          onChange={handleBulkChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={bulkOrder.pincode}
          onChange={handleBulkChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={bulkOrder.productName}
          onChange={handleBulkChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity (min 50 kg)"
          value={bulkOrder.quantity}
          onChange={handleBulkChange}
          className="w-full border px-3 py-2 rounded-md"
          min="50"
        />

        <input
          type="number"
          name="price"
          placeholder="Price per kg"
          value={bulkOrder.price}
          onChange={handleBulkChange}
          className="w-full border px-3 py-2 rounded-md"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateBulkOrder}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Bulk
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBulkOrderModal;
