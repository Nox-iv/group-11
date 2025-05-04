const wishlistService = require("../logic/wishlistLogic");
 

exports.createWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.createWishlist(req.body);
        res.status(201).json(wishlist);
    } catch (error) {
        console.error("Error creating wishlist:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

exports.addMediaToWishlist = async (req, res) => {
    try {
        const newItem = await wishlistService.addMediaToWishlist(req.params.id, req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding media to wishlist:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.removeMediaFromWishlist = async (req, res) => {
    try {
        const message = await wishlistService.removeMediaFromWishlist(req.params.wishlistId, req.params.mediaId);
        res.status(200).json({ message });
    } catch (error) {
        console.error("Error removing media from wishlist:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteWishlist = async (req, res) => {
    try {
        await wishlistService.deleteWishlist(req.params.id);
        res.json({ message: "Wishlist was deleted" });
    } catch (error) {
        console.error("Error deleting wishlist:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await wishlistService.getAllWishlists();
        res.json(wishlists);
    } catch (error) {
        console.error("Error fetching wishlists:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getWishlistWithDetails = async (req, res) => {
    try {
        const wishlist = await wishlistService.getWishlistWithDetails(req.params.id);
        res.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist details:", error);
        res.status(500).json({ error: "Server error" });
    }
};
