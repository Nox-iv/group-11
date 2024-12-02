const express = require("express");
const router = express.Router();
const accountantController = require("../controllers/accountantController");

// Get Member Subscription list
router.get("/", accountantController.getMemberSubscriptionList);

// Upgrade or Downgrade Member Subscription
router.put("/", accountantController.updateMemberSubscription);

module.exports = router;
