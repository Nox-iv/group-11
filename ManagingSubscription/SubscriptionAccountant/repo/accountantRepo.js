const pool = require("../db");

// Existing functions
exports.getMemberSubscriptionList = async () => {
    return pool.query(`
        SELECT ms.*, st.subtype, st.price
        FROM memberSubscription ms
        JOIN subscriptionType st ON ms.subid = st.subid
    `);
};

exports.getSubscriptionType = async (subid) => {
    return pool.query("SELECT * FROM subscriptionType WHERE subid = $1", [subid]);
};

exports.updateMemberSubscription = async (new_subid, interval, member_id) => {
    return pool.query(
        `UPDATE memberSubscription 
         SET subid = $1, 
             start_date = CURRENT_TIMESTAMP, 
             end_date = CURRENT_TIMESTAMP + INTERVAL '${interval}' 
         WHERE member_id = $2 
         RETURNING *`,
        [new_subid, member_id]
    );
};

// New billing-related functions
exports.getAllBillingRecords = async () => {
    return pool.query(`
        SELECT sb.*, ms.member_id, st.subtype, st.price
        FROM subscriptionBilling sb
        JOIN memberSubscription ms ON sb.subscription_id = ms.id
        JOIN subscriptionType st ON ms.subid = st.subid
        ORDER BY sb.billing_date DESC
    `);
};

exports.getBillingHistory = async (subscription_id) => {
    return pool.query(
        `SELECT * FROM subscriptionBilling 
         WHERE subscription_id = $1 
         ORDER BY billing_date DESC`,
        [subscription_id]
    );
};

exports.getBillingById = async (billing_id) => {
    return pool.query(
        "SELECT * FROM subscriptionBilling WHERE billing_id = $1",
        [billing_id]
    );
};

exports.updateBillingStatus = async (billing_id, status) => {
    return pool.query(
        `UPDATE subscriptionBilling 
         SET payment_status = $2
         WHERE billing_id = $1 
         RETURNING *`,
        [billing_id, status]
    );
};

exports.getSubscriptionWithBilling = async (subscription_id) => {
    return pool.query(`
        SELECT ms.*, st.subtype, st.price,
               sb.billing_id, sb.payment_amount, sb.payment_status, sb.billing_date
        FROM memberSubscription ms
        JOIN subscriptionType st ON ms.subid = st.subid
        LEFT JOIN subscriptionBilling sb ON sb.subscription_id = ms.id
        WHERE ms.id = $1`,
        [subscription_id]
    );
};

exports.getMemberSubscriptionById = async (subscription_id) => {
    return pool.query(
        "SELECT * FROM memberSubscription WHERE id = $1",
        [subscription_id]
    );
};