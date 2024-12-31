const axios = require("axios");
const accountantRepository = require("../repo/accountantRepo");

const MEMBER_API_BASE_URL = "http://localhost:3002";

// Existing exports
exports.getMemberSubscriptionList = async () => {
    // First get the subscription list
    const memberSubList = await accountantRepository.getMemberSubscriptionList();

    // Then enrich each record with member details
    const enrichedList = await Promise.all(memberSubList.rows.map(async (sub) => {
        try {
            const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${sub.member_id}`);
            const memberData = memberResponse.data;
            
            return {
                ...sub,
                member_name: `${memberData.firstName} ${memberData.lastName}`
            };
        } catch (err) {
            console.error(`Failed to fetch member data for ID ${sub.member_id}:`, err);
            return {
                ...sub,
                member_name: 'Name Not Available'
            };
        }
    }));

    return enrichedList;
};

exports.updateMemberSubscription = async ({ member_id, new_subid }) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const subResult = await accountantRepository.getSubscriptionType(new_subid);
    if (subResult.rows.length === 0) {
        throw new Error("Subscription type not found"); 
    }

    const { duration } = subResult.rows[0];
    let interval = duration.months ? `${duration.months} months` : `${duration.years} years`;

    const result = await accountantRepository.updateMemberSubscription(new_subid, interval, member_id);
    return result.rows[0];
};

// New billing-related exports
exports.getAllBillingRecords = async () => {
    const billingRecords = await accountantRepository.getAllBillingRecords();
    return billingRecords.rows;
};

exports.getBillingHistory = async (subscriptionId) => {
    const subscription = await accountantRepository.getMemberSubscriptionById(subscriptionId);
    if (subscription.rows.length === 0) {
        throw new Error("Subscription not found");
    }

    const billingHistory = await accountantRepository.getBillingHistory(subscriptionId);
    return billingHistory.rows;
};

exports.updateBillingStatus = async (billingId, status) => {
    const billing = await accountantRepository.getBillingById(billingId);
    if (billing.rows.length === 0) {
        throw new Error("Billing record not found");
    }

    const result = await accountantRepository.updateBillingStatus(billingId, status);
    return result.rows[0];
};

// Additional helper for getting subscription with billing details
exports.getSubscriptionWithBilling = async (subscriptionId) => {
    const subscription = await accountantRepository.getSubscriptionWithBilling(subscriptionId);
    if (subscription.rows.length === 0) {
        throw new Error("Subscription not found");
    }
    return subscription.rows[0];
};