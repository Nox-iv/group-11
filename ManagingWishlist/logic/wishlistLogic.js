const axios = require("axios");
const wishlistRepository = require("../repositories/wishlistRepo");

const MEDIA_API_BASE_URL = "http://localhost:3001";
const MEMBER_API_BASE_URL = "http://localhost:3002";

exports.createWishlist = async ({ wishlistName, member_id }) => {
  const result = await wishlistRepository.createWishlist(wishlistName, member_id);
  return result.rows[0];
};

exports.addMediaToWishlist = async (wishlistId, { media_id }) => {
  const mediaResponse = await axios.get(`${MEDIA_API_BASE_URL}/media/${media_id}`);
  if (!mediaResponse.data) throw new Error("Media not found");

  const wishlist = await wishlistRepository.getWishlistById(wishlistId);
  if (wishlist.rows.length === 0) throw new Error("Wishlist not found");

  const { name: wishlist_name, member_id } = wishlist.rows[0];

  const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
  if (!memberResponse.data) throw new Error("Member not found");

  const { member_name } = memberResponse.data;

  const newItem = await wishlistRepository.addMediaToWishlist(
    wishlistId,
    wishlist_name,
    member_id,
    member_name,
    media_id
  );
  return newItem.rows[0];
};

exports.removeMediaFromWishlist = async (wishlistId, mediaId) => {
  const result = await wishlistRepository.removeMediaFromWishlist(wishlistId, mediaId);
  if (result.rowCount === 0) throw new Error("Item not found");
  return "Media removed from wishlist";
};

exports.deleteWishlist = async (id) => {
  await wishlistRepository.deleteWishlistItems(id);
  await wishlistRepository.deleteWishlist(id);
};

exports.getAllWishlists = async () => {
  const allWishlists = await wishlistRepository.getAllWishlists();
  return allWishlists.rows;
};

exports.getWishlistWithDetails = async (id) => {
  const wishlist = await wishlistRepository.getWishlistWithDetails(id);
  if (wishlist.rows.length === 0) throw new Error("Wishlist not found");

  const mediaDetails = await Promise.all(
    wishlist.rows.map(async (item) => {
      if (!item.media_id) return item;
      const mediaResponse = await axios.get(`${MEDIA_API_BASE_URL}/media/${item.media_id}`);
      return {
        ...item,
        media_name: mediaResponse.data.media_name,
        media_type: mediaResponse.data.media_type,
        availability: mediaResponse.data.availability,
      };
    })
  );

  return mediaDetails;
};
