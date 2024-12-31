const pool = require("../db");

exports.getSubscriptionTypes = async () => {
    return pool.query(
        "SELECT subid, subtype, price, duration FROM subscriptionType"
    );
};

exports.getSubscriptionType = async (subid) => {
    return pool.query("SELECT * FROM subscriptionType WHERE subid = $1", [subid]);
};

exports.createMemberSubscription = async (member_id, subid, interval, first_name, last_name) => {
    return pool.query(
        `INSERT INTO memberSubscription 
         (member_id, subid, first_name, last_name, start_date, end_date, status) 
         VALUES 
         ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '${interval}', 'active') 
         RETURNING *`,
        [member_id, subid, first_name, last_name]
    );
};

exports.updateMemberSubscription = async (member_id, subid, interval) => {
    return pool.query(
        `UPDATE memberSubscription SET subid=$1, start_date=CURRENT_TIMESTAMP, end_date=CURRENT_TIMESTAMP + INTERVAL'${interval}' WHERE member_id=$2 RETURNING *`,
        [subid, member_id]
    );
};

exports.checkMemberSubscription = async (member_id) => {
    return pool.query(
        "SELECT * FROM memberSubscription WHERE member_id = $1",
        [member_id]
    );
};

exports.removeMemberSubscription = async (member_id, subid) => {
    return pool.query("DELETE FROM memberSubscription WHERE member_id = $1 AND subid = $2", [member_id, subid]);
};

// New methods for member billing features
exports.getCurrentMemberSubscription = async (member_id) => {
    return pool.query(
        `SELECT ms.*, st.subtype, st.price, st.duration,
                sb.payment_status, sb.payment_method, sb.billing_date
         FROM memberSubscription ms
         JOIN subscriptionType st ON ms.subid = st.subid
         LEFT JOIN subscriptionBilling sb ON sb.subscription_id = ms.id
         WHERE ms.member_id = $1 
         AND ms.end_date > CURRENT_TIMESTAMP
         ORDER BY ms.start_date DESC 
         LIMIT 1`,
        [member_id]
    );
};

exports.getBillingHistory = async (member_id) => {
    return pool.query(
        `SELECT sb.*, ms.start_date, ms.end_date, st.subtype, st.price
         FROM subscriptionBilling sb
         JOIN memberSubscription ms ON sb.subscription_id = ms.id
         JOIN subscriptionType st ON ms.subid = st.subid
         WHERE ms.member_id = $1
         ORDER BY sb.billing_date DESC`,
        [member_id]
    );
};

exports.addBillingRecord = async (subscription_id, payment_amount, payment_method, payment_status) => {
    return pool.query(
        `INSERT INTO subscriptionBilling 
         (subscription_id, payment_amount, payment_method, payment_status) 
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [subscription_id, payment_amount, payment_method, payment_status]
    );
};

exports.updateSubscriptionStatus = async (member_id, status) => {
    return pool.query(
        `UPDATE memberSubscription 
         SET status = $2
         WHERE member_id = $1 
         AND end_date > CURRENT_TIMESTAMP
         RETURNING *`,
        [member_id, status]
    );
};

exports.updateAutoRenewal = async (member_id, auto_renew) => {
    return pool.query(
        `UPDATE memberSubscription 
         SET auto_renew = $2
         WHERE member_id = $1 
         AND end_date > CURRENT_TIMESTAMP
         RETURNING *`,
        [member_id, auto_renew]
    );
};