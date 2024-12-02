const accountantService = require("../logic/accountantLogic");

exports.getMemberSubscriptionList = async (req, res) => {
    try {
        const memberSubList = await accountantService.getMemberSubscriptionList();
        res.status(200).json(memberSubList);
    } catch (err) {
        console.error("Error getting subscription list:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateMemberSubscription = async (req, res) => {
    try {
        const result = await accountantService.updateMemberSubscription(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error upgrading/downgrading subscription:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
