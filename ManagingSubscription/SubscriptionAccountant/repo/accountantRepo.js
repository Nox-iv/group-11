const pool = require("../db");

exports.getMemberSubscriptionList = async () => {
    return pool.query("SELECT * FROM memberSubscription");
};

exports.getSubscriptionType = async (subid) => {
    return pool.query("SELECT * FROM subscriptionType WHERE subid = $1", [subid]);
};

exports.updateMemberSubscription = async (new_subid, interval, member_id) => {
    return pool.query(
        `UPDATE memberSubscription SET subid = $1, start_date = CURRENT_TIMESTAMP, end_date = CURRENT_TIMESTAMP + INTERVAL '${interval}' WHERE member_id = $2 RETURNING *`,
        [new_subid, member_id]
    );
};
