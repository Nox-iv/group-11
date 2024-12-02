const pool = require("../db");

exports.getSubscriptionList = async () => {
    return pool.query("SELECT * FROM subscriptionType");
};

exports.getSubscriptionType = async (subid) => {
    return pool.query("SELECT * FROM subscriptionType WHERE subid = $1", [subid]);
};

exports.createMemberSubscription = async (member_id, subid, interval) => {
    return pool.query(
        `INSERT INTO memberSubscription (member_id, subid, start_date, end_date) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '${interval}') RETURNING *`,
        [member_id, subid]
    );
};

exports.updateMemberSubscription = async (member_id, subid, interval) => {
    return pool.query(
        `UPDATE memberSubscription SET subid=$1, start_date=CURRENT_TIMESTAMP, end_date=CURRENT_TIMESTAMP + INTERVAL'${interval}' WHERE member_id=$2 RETURNING *`,
        [subid, member_id]
    );
};

exports.checkMemberSubscription = async (member_id, subid) => {
    return pool.query("SELECT * FROM memberSubscription WHERE member_id = $1 AND subid = $2", [member_id, subid]);
};

exports.removeMemberSubscription = async (member_id, subid) => {
    return pool.query("DELETE FROM memberSubscription WHERE member_id = $1 AND subid = $2", [member_id, subid]);
};
