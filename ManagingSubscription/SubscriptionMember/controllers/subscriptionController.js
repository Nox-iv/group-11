const subscriptionService = require("../logic/subscriptionLogic");

// Existing endpoints
exports.getSubscriptionTypes = async (req, res) => {
    try {
        const subscriptions = await subscriptionService.getSubscriptionTypes();
        res.status(200).json(subscriptions);
    } catch (err) {
        console.error("Error getting subscription list:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.subscribeToLibrary = async (req, res) => {
    try {
        const subscription = await subscriptionService.subscribeToLibrary(req.body);
        res.status(201).json(subscription);
    } catch (err) {
        console.error("Error subscribing to the library system:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const updatedSubscription = await subscriptionService.updateSubscription(req.body);
        res.status(200).json(updatedSubscription);
    } catch (err) {
        console.error("Error updating subscription:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.removeSubscription = async (req, res) => {
    try {
        await subscriptionService.removeSubscription(req.body);
        res.status(200).json({ message: "Subscription removed successfully" });
    } catch (err) {
        console.error("Error removing subscription:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// // New endpoints to match routes
// exports.getSubscriptionTypes = async (req, res) => {
//     try {
//         const types = await subscriptionService.getSubscriptionTypes();
//         res.status(200).json(types);
//     } catch (err) {
//         console.error("Error getting subscription types:", err.message);
//         res.status(500).json({ error: "Server error" });
//     }
// };

exports.getMemberSubscription = async (req, res) => {
    try {
        const { memberId } = req.params;
        const subscription = await subscriptionService.getCurrentSubscription(memberId);
        res.status(200).json(subscription);
    } catch (err) {
        console.error("Error getting member subscription:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.processPayment = async (req, res) => {  
    try {
        const payment = await subscriptionService.processPayment(req.body);
        res.status(200).json(payment);
    } catch (err) {
        console.error("Error processing payment:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.getBillingHistory = async (req, res) => {
    try {
        const { memberId } = req.params;
        const history = await subscriptionService.getBillingHistory(memberId);
        res.status(200).json(history);
    } catch (err) {
        console.error("Error fetching billing history:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.renewSubscription = async (req, res) => {
    try {
        const renewed = await subscriptionService.renewSubscription(req.body);
        res.status(200).json(renewed);
    } catch (err) {
        console.error("Error renewing subscription:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

exports.toggleAutoRenewal = async (req, res) => {
    try {
        const { memberId, autoRenew } = req.body;
        const updated = await subscriptionService.toggleAutoRenewal(memberId, autoRenew);
        res.status(200).json(updated);
    } catch (err) {
        console.error("Error toggling auto-renewal:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};