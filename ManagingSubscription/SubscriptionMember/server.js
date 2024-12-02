const express = require("express");
const cors = require("cors");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/subscription", subscriptionRoutes);

// Start the server
app.listen(5000, () => {
    console.log("Server has started on port 5000");
});
