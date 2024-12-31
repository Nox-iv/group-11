// src/features/components/wishlist/WishlistCard.jsx
import React, { useState, useEffect } from 'react';
import wishlistService from '../../services/wishlistService';
import { useCallback } from 'react';

const WishlistCard = ({ wishlist, onDelete }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMediaId, setNewMediaId] = useState('');
  
    const loadWishlistItems = useCallback(async () => {
      const details = await wishlistService.getWishlistById(wishlist.id);
      setItems(details);
      setLoading(false);
    }, [wishlist.id]);
  
    useEffect(() => {
      loadWishlistItems();
    }, [loadWishlistItems]);

    const handleAddMedia = async (e) => {
        e.preventDefault();
        if (!newMediaId.trim()) {
          alert('Please enter a valid Media ID');
          return;
        }
        
        try {
          await wishlistService.addMediaToWishlist(wishlist.id, parseInt(newMediaId));
          setNewMediaId('');
          loadWishlistItems();
        } catch (err) {
          alert('Failed to add media');
        }
      };

  const handleRemoveMedia = async (mediaId) => {
    await wishlistService.removeMedia(wishlist.id, mediaId);
    loadWishlistItems();
  };

  if (loading) return <div>Loading items...</div>;

  return (
    <div className="border p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{wishlist.name}</h2>
        <button 
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          Delete Wishlist
        </button>
      </div>

      <form onSubmit={handleAddMedia} className="mb-4">
        <input
          type="text"
          value={newMediaId}
          onChange={(e) => setNewMediaId(e.target.value)}
          placeholder="Media ID"
          className="p-2 border rounded"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Add Media
        </button>
      </form>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.item_id} className="flex justify-between items-center p-2 bg-gray-50">
            <span>Media ID: {item.media_id}</span>
            <button
              onClick={() => handleRemoveMedia(item.media_id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistCard;