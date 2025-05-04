const express = require("express");
const cors = require("cors");
const accountantRoutes = require("./routes/accountantRoutes");
const authRoutes       = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication endpoint
app.use("/auth", authRoutes);

// Routes
app.use("/subscription/memberSub", accountantRoutes);       

// Start the server
app.listen(5001, () => {
    console.log("Server has started on port 5001");
});
 