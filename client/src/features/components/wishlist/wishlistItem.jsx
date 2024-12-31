// src/features/components/wishlist/WishlistItem.jsx
import React from 'react';

const WishlistItem = ({ item, onDelete }) => {
  return (
    <div className="wishlist-item border p-4 mb-2 rounded shadow">
      <h3 className="text-lg font-bold">{item.title}</h3>
      <p className="text-gray-600">{item.author}</p>
      <p>{item.description}</p>
      <div className="mt-2">
        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        > 
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;