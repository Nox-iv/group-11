const accountantLogic = require("../logic/accountantLogic");

exports.getMemberSubscriptionList = async (req, res) => {
    try {
        const memberSubList = await accountantLogic.getMemberSubscriptionList();
        res.status(200).json(memberSubList);
    } catch (err) {
        console.error("Error getting subscription list:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};
    
exports.updateMemberSubscription = async (req, res) => {
    try {
        const result = await accountantLogic.updateMemberSubscription(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error upgrading/downgrading subscription:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// New billing-related exports
exports.getAllBillingRecords = async (req, res) => {
    try {
        const billingRecords = await accountantLogic.getAllBillingRecords();
        res.status(200).json(billingRecords);
    } catch (err) {
        console.error("Error getting billing records:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getBillingHistory = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const history = await accountantLogic.getBillingHistory(subscriptionId);
        res.status(200).json(history);
    } catch (err) {
        console.error("Error getting billing history:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateBillingStatus = async (req, res) => {
    try {
        const { billingId } = req.params;
        const { status } = req.body;
        const updated = await accountantLogic.updateBillingStatus(billingId, status);
        res.status(200).json(updated);
    } catch (err) {
        console.error("Error updating billing status:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};