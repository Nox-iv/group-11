import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import wishlistService from '../../services/wishlistService';

const WishlistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlistDetails = useCallback(async () => {
    try {
      const details = await wishlistService.getWishlistById(id);
      setWishlist(details);
      
      const mediaDetails = details.map(item => ({
        ...item,
        availability: 'Available',
        canBorrow: true,
        canReserve: true
      }));
      
      setMediaItems(mediaDetails);
    } catch (error) {
      console.error('Error loading wishlist details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWishlistDetails();
  }, [loadWishlistDetails]);

  const handleDeleteWishlist = async () => {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await wishlistService.deleteWishlist(id);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error deleting wishlist:', error);
        alert('Failed to delete wishlist');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{wishlist?.[0]?.wishlist_name}</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleDeleteWishlist}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Wishlist
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {mediaItems.map(item => (
          <div key={item.media_id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{item.media_name}</h3>
                <p className="text-gray-600">{item.media_type}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded ${
                    item.canBorrow 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  disabled={!item.canBorrow}
                >
                  Borrow
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    item.canReserve 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  disabled={!item.canReserve}
                >
                  Reserve
                </button>
                <button
                  onClick={async () => {
                    await wishlistService.removeMedia(wishlist[0].wishlist_id, item.media_id);
                    loadWishlistDetails();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-sm ${
                item.availability === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.availability}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistDetailPage;