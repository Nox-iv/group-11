// src/features/pages/wishlist/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaCatalog from '../../components/media/mediaCatalog';
import wishlistService from '../../services/wishlistService';

const WishlistPage = () => {
  // Navigation and state management
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState([]);   
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [showNewWishlistForm, setShowNewWishlistForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');

  // Load wishlists when component mounts
  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      const data = await wishlistService.getAllWishlists();
      setWishlists(data);
    } catch (error) {
      console.error('Error loading wishlists:', error);
    }
  };

  // Handle creating new wishlist
  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    try {
      const newWishlist = await wishlistService.createWishlist({
        wishlistName: newWishlistName,
        member_id: '1'
      });
      setWishlists([...wishlists, newWishlist]);
      setNewWishlistName('');
      setShowNewWishlistForm(false);
    } catch (error) {
      console.error('Error creating wishlist:', error);
    }
  };

  // Handle wishlist selection and navigation
  const handleWishlistClick = (wishlist) => {
    setSelectedWishlist(wishlist);
  };

  const handleWishlistDoubleClick = (wishlist) => {
    navigate(`/wishlist/${wishlist.id}`);
  };

  // Handle adding media to selected wishlist
  const handleAddToWishlist = async (mediaItem) => {
    if (!selectedWishlist) {
      alert('Please select a wishlist first');
      return;
    }

    try {
      await wishlistService.addMediaToWishlist(selectedWishlist.id, mediaItem.id);
      alert('Media added to wishlist successfully');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add media to wishlist');
    }
  };

  // Handle wishlist deletion
  const handleDeleteWishlist = async (wishlistId, event) => {
    event.stopPropagation(); // Prevent triggering click/double-click events
    
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await wishlistService.deleteWishlist(wishlistId);
        setWishlists(wishlists.filter(w => w.id !== wishlistId));
        if (selectedWishlist?.id === wishlistId) {
          setSelectedWishlist(null);
        }
      } catch (error) {
        console.error('Error deleting wishlist:', error);
        alert('Failed to delete wishlist');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header section with create new wishlist button */}
      <div className="flex justify-between items-center mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Media Library</h1>
        <h2 className="text-2xl text-gray-600">Wishlists</h2>
      </div>
        <button 
          onClick={() => setShowNewWishlistForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create New Wishlist
        </button>
      </div>

      {/* New wishlist creation form */}
      {showNewWishlistForm && (
        <form onSubmit={handleCreateWishlist} className="mb-6 p-4 border rounded shadow-sm">
          <input
            type="text"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            placeholder="Wishlist Name"
            className="border p-2 rounded mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
        </form>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar with wishlists */}
        <div className="col-span-1 border rounded p-4 shadow-sm">
          <h2 className="font-bold mb-4">My Wishlists</h2>
          {wishlists.map(wishlist => (
            <div key={wishlist.id} className="flex items-center mb-2 group">
              <button
                onClick={() => handleWishlistClick(wishlist)}
                onDoubleClick={() => handleWishlistDoubleClick(wishlist)}
                className={`flex-grow text-left p-2 rounded ${
                  selectedWishlist?.id === wishlist.id 
                    ? 'bg-blue-100' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {wishlist.name}
              </button>
              <button
                onClick={(e) => handleDeleteWishlist(wishlist.id, e)}
                className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Wishlist"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Media catalog section */}
        <div className="col-span-3">
          <MediaCatalog onAddToWishlist={handleAddToWishlist} />
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;