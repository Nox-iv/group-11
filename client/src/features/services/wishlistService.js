// src/features/services/wishlistService.js
const API_BASE_URL = 'http://localhost:5002/wishlists';

export const wishlistService = {
  async createWishlist(data) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wishlistName: data.wishlistName,
        member_id: data.member_id
      })
    });
    if (!response.ok) throw new Error('Failed to create wishlist');
    return response.json();
  },

  async addMediaToWishlist(wishlistId, mediaId) {
    const response = await fetch(`${API_BASE_URL}/${wishlistId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ media_id: mediaId })
    });
    if (!response.ok) throw new Error('Failed to add media');
    return response.json();
  },

  async removeMedia(wishlistId, mediaId) {
    const response = await fetch(`${API_BASE_URL}/${wishlistId}/media/${mediaId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove media');
    return response.json();
  },

  async deleteWishlist(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete wishlist');
    return response.json();
  },

  async getAllWishlists() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch wishlists');
    return response.json();
  },

  async getWishlistById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  }
};

export default wishlistService;