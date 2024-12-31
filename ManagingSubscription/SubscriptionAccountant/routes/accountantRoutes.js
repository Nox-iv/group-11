const express = require("express");
const router = express.Router();
const accountantController = require("../controllers/accountantController");

// Get Member Subscription list
router.get("/", accountantController.getMemberSubscriptionList);

// Upgrade or Downgrade Member Subscription
router.put("/", accountantController.updateMemberSubscription);

// New routes for billing management
router.get("/billing", accountantController.getAllBillingRecords);
router.get("/billing/:subscriptionId", accountantController.getBillingHistory);
router.put("/billing/:billingId", accountantController.updateBillingStatus);

module.exports = router;
