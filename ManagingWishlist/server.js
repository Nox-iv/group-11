const express = require("express");
const cors = require("cors");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/wishlists", wishlistRoutes);

// Start the server
app.listen(5002, () => { 
  console.log("Server has started on port 5002");
});

// functions.http('handleRequests', app); 

 