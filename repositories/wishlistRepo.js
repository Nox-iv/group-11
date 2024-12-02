const pool = require("../db");

exports.createWishlist = async (wishlistName, member_id) => {
    return pool.query(
        "INSERT INTO wishlists (name, member_id) VALUES ($1, $2) RETURNING *",
        [wishlistName, member_id]
    );
};

exports.getWishlistById = async (id) => {
    return pool.query('SELECT name, member_id FROM wishlists WHERE id = $1', [id]);
};

exports.addMediaToWishlist = async (wishlistId, wishlist_name, member_id, member_name, media_id) => {
    return pool.query(
        "INSERT INTO wishlist_items (wishlist_id, wishlist_name, member_id, member_name, media_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [wishlistId, wishlist_name, member_id, member_name, media_id]
    );
};

exports.removeMediaFromWishlist = async (wishlistId, mediaId) => {
    return pool.query(
        "DELETE FROM wishlist_items WHERE wishlist_id = $1 AND media_id = $2 RETURNING *",
        [wishlistId, mediaId]
    );
};

exports.deleteWishlistItems = async (id) => {
    return pool.query("DELETE FROM wishlist_items WHERE wishlist_id = $1", [id]);
};

exports.deleteWishlist = async (id) => {
    return pool.query("DELETE FROM wishlists WHERE id = $1", [id]);
};

exports.getAllWishlists = async () => {
    return pool.query("SELECT * FROM wishlists");
};

exports.getWishlistWithDetails = async (id) => {
    return pool.query(
        `SELECT w.id AS wishlist_id, w.name AS wishlist_name, w.member_id, wi.id AS item_id, wi.media_id
        FROM wishlists w
        LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
        WHERE w.id = $1`,
        [id]
    );
};
