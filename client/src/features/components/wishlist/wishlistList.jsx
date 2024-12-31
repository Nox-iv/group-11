// src/features/components/wishlist/WishlistList.jsx
import React from 'react';
import WishlistItem from './wishlistItem';

const WishlistList = ({ items, onDelete }) => {
  if (!items.length) {
    return <p>No items in wishlist</p>;
  }

  return (
    <div className="wishlist-list">
      {items.map(item => (
        <WishlistItem 
          key={item.id} 
          item={item} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WishlistList;