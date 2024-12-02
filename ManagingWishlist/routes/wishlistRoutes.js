const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Create a new wishlist
router.post("/", wishlistController.createWishlist);

// Add media to wishlist
router.post("/:id/media", wishlistController.addMediaToWishlist);

// Remove media from a wishlist
router.delete("/:wishlistId/media/:mediaId", wishlistController.removeMediaFromWishlist);

// Delete a wishlist
router.delete("/:id", wishlistController.deleteWishlist);

// Get all wishlists
router.get("/", wishlistController.getAllWishlists);

// Get a specific wishlist with media details
router.get("/:id", wishlistController.getWishlistWithDetails);

module.exports = router;
