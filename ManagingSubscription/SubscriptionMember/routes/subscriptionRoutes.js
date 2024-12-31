const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// Get subscription list
router.get("/types", subscriptionController.getSubscriptionTypes);

// Member subscribes to library system
router.post("/", subscriptionController.subscribeToLibrary);

// Member upgrade or downgrade subscription
router.put("/", subscriptionController.updateSubscription);

// Member remove subscription
router.delete("/", subscriptionController.removeSubscription);

// Billing routes
router.get("/member/:memberId", subscriptionController.getMemberSubscription);
router.post("/billing", subscriptionController.processPayment);
router.get("/billing/history/:memberId", subscriptionController.getBillingHistory);
router.post("/renew", subscriptionController.renewSubscription);
router.put("/auto-renew", subscriptionController.toggleAutoRenewal);

module.exports = router;
