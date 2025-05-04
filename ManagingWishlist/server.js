require('dotenv').config();

const express = require("express");
const cors = require("cors");

const wishlistRoutes = require("./routes/wishlistRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ Add this line

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/wishlists", wishlistRoutes);
app.use("/auth", authRoutes); // ✅ Add this line

// Start the server
app.listen(5002, () => { 
  console.log("Server has started on port 5002");
});
