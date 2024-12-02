const subscriptionService = require("../services/subscriptionService");

exports.getSubscriptionList = async (req, res) => {
    try {
        const subscriptions = await subscriptionService.getSubscriptionList();
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
