const express = require("express");
const cors = require("cors");
const accountantRoutes = require("./routes/accountantRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/subscription/memberSub", accountantRoutes);       

// Start the server
app.listen(5001, () => {
    console.log("Server has started on port 5001");
});
 