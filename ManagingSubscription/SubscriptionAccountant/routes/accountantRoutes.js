const express = require("express");
const router = express.Router();
const accountantController = require("../controllers/accountantController");
const authMiddleware = require("../authMiddleware");

// Require a valid JWT on all accountant routes
router.use(authMiddleware);

// Get Member Subscription list
router.get("/", accountantController.getMemberSubscriptionList);

// Upgrade or Downgrade Member Subscription
router.put("/", accountantController.updateMemberSubscription);

// Billing management routes
router.get("/billing", accountantController.getAllBillingRecords);
router.get("/billing/:subscriptionId", accountantController.getBillingHistory);
router.put("/billing/:billingId", accountantController.updateBillingStatus);

module.exports = router;
