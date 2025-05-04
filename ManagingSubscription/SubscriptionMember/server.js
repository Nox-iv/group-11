const express = require("express");
const cors = require("cors");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const authRoutes = require("./routes/authRoutes"); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication endpoint
+app.use("/auth", authRoutes);

// Routes
app.use("/subscription", subscriptionRoutes);

// Start the server
app.listen(5000, () => {
    console.log("Server has started on port 5000");
});
