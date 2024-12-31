const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.post("/", wishlistController.createWishlist);     

router.post("/:id/media", wishlistController.addMediaToWishlist);

router.delete("/:wishlistId/media/:mediaId", wishlistController.removeMediaFromWishlist);

router.delete("/:id", wishlistController.deleteWishlist);

router.get("/", wishlistController.getAllWishlists);

router.get("/:id", wishlistController.getWishlistWithDetails);

module.exports = router;
