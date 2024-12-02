const express = require("express");
const axios = require("axios");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// External API Base URLs
const MEDIA_API_BASE_URL = "http://localhost:3001"; // Media Mock API
const MEMBER_API_BASE_URL = "http://localhost:3002"; // Members Mock API

// Routes 

// Create a new wishlist
app.post("/wishlists", async (req, res) => {
    const { wishlistName, member_id } = req.body;
    
    try {
      const result = await pool.query(
        "INSERT INTO wishlists (name, member_id) VALUES ($1, $2) RETURNING *",
        [wishlistName, member_id]
      );
      res.status(201).json(result.rows[0]); // send the created wishlist
    } catch (error) {
      console.error("Error creating wishlist:", error); // Log the error to console
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });
  


// Add media to wishlist
app.post("/wishlists/:id/media", async (req, res) => {
  try {
    const { id } = req.params; // Wishlist ID
    const { media_id } = req.body; // Media ID

    // Validate media_id via Mockoon
    const mediaResponse = await axios.get(`${MEDIA_API_BASE_URL}/media/${media_id}`);
    if (!mediaResponse.data) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Fetch wishlist details
    const wishlistResponse = await pool.query('SELECT name, member_id FROM wishlists WHERE id = $1', [id]);
    if (wishlistResponse.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found" });
    }
    const { name: wishlist_name, member_id } = wishlistResponse.rows[0];

    // Fetch member details via Mockoon
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
    if (!memberResponse.data) {
      return res.status(404).json({ error: "Member not found" });
    }
    console.log('Member API response:', memberResponse.data);

    // Access member_name from the response
    const { member_name } = memberResponse.data;

    // Add media to the wishlist with additional details
    const newItem = await pool.query(
      "INSERT INTO wishlist_items (wishlist_id, wishlist_name, member_id, member_name, media_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, wishlist_name, member_id, member_name, media_id]
    );

    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error("Error adding media to wishlist:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// Remove media from a wishlist
app.delete('/wishlists/:wishlistId/media/:mediaId', async (req, res) => {
    const { wishlistId, mediaId } = req.params;

    try {
        const query = `
            DELETE FROM wishlist_items
            WHERE wishlist_id = $1 AND media_id = $2
            RETURNING *;
        `;
        const values = [parseInt(wishlistId), parseInt(mediaId)];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Media removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete a wishlist
app.delete("/wishlists/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete wishlist items
    await pool.query("DELETE FROM wishlist_items WHERE wishlist_id = $1", [id]);

    // Delete wishlist
    await pool.query("DELETE FROM wishlists WHERE id = $1", [id]);

    res.json({ message: "Wishlist was deleted" });
  } catch (err) {
    console.error("Error deleting wishlist:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all wishlists
app.get("/wishlists", async (req, res) => {
  try {
    const allWishlists = await pool.query("SELECT * FROM wishlists");
    res.json(allWishlists.rows);
  } catch (err) {
    console.error("Error fetching wishlists:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific wishlist with media details
app.get("/wishlists/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get wishlist and its items
    const wishlist = await pool.query(
      `SELECT w.id AS wishlist_id, w.name AS wishlist_name, w.member_id, wi.id AS item_id, wi.media_id
       FROM wishlists w
       LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
       WHERE w.id = $1`,
      [id]
    );
 
    if (wishlist.rows.length === 0) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    // Fetch media details for each media_id
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

    res.json(mediaDetails);
  } catch (err) {
    console.error("Error fetching wishlist details:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
