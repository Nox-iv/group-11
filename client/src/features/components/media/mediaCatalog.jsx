// src/features/components/media/MediaCatalog.jsx
import React from 'react';

const MediaCatalog = ({ onAddToWishlist }) => {
  // Temporary mock data until the real catalog is ready
  const mockMediaItems = [
    { id: 1, title: 'The Great Gatsby', type: 'Book', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'Inception', type: 'DVD', director: 'Christopher Nolan' },
    { id: 3, title: 'Gruppa krovi', type: 'Album', author: 'Kino' },
    { id: 4, title: 'To Kill a Mockingbird', type: 'Book', author: 'Harper Lee' },
    { id: 5, title: 'Macbeth', type: 'Book', author: 'William Shakespeare' },
    { id: 6, title: 'The Adventures of Tom Sawyer', type: 'Book', author: 'Mark Twain' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockMediaItems.map(item => (
        <div key={item.id} className="border rounded-lg p-4 shadow">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-gray-600">{item.type}</p>
          <p className="text-gray-600">{item.author || item.director}</p>
          <button 
            onClick={() => onAddToWishlist(item)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add to Wishlist
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaCatalog;