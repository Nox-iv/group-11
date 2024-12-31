const axios = require("axios");
const subscriptionRepository = require("../repo/subscriptionRepo.js");

const MEMBER_API_BASE_URL = "http://localhost:3002";
 
exports.getSubscriptionTypes = async () => {
    const types = await subscriptionRepository.getSubscriptionTypes();
    return types.rows;  
};

exports.subscribeToLibrary = async ({ subid, first_name, last_name, payment_method }) => {
    // Simulate member_id generation (since we're using mock service)
    const member_id = Math.floor(Math.random() * 1000) + 1;  // or any fixed number like 1
    
    // Check if subscription type exists
    const subResult = await subscriptionRepository.getSubscriptionType(subid);
    if (subResult.rows.length === 0) {
        throw new Error("Subscription type not found");
    }

    // Calculate duration
    const { duration, price } = subResult.rows[0];
    let interval = "";
    if (duration.months) {
        interval = `${duration.months} months`;
    } else if (duration.years) {
        interval = `${duration.years} years`;
    }

    // Create subscription with all fields
    const subscriptionResult = await subscriptionRepository.createMemberSubscription(
        member_id,      // Keep this for consistency
        subid, 
        interval,
        first_name, 
        last_name
    );

    // Create billing record after successful subscription
    if (subscriptionResult.rows[0]) {
        await subscriptionRepository.addBillingRecord(
            subscriptionResult.rows[0].id,
            price,
            payment_method,
            'pending'
        );
    }

    return subscriptionResult.rows[0];
};

exports.updateSubscription = async ({ member_id, subid }) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const subResult = await subscriptionRepository.getSubscriptionType(subid);
    if (subResult.rows.length === 0) {
        throw new Error("Subscription type not found");
    }

    const { duration } = subResult.rows[0];
    let interval = "";
    if (duration.months) {
        interval = `${duration.months} months`;
    } else if (duration.years) {
        interval = `${duration.years} years`;
    }

    const result = await subscriptionRepository.updateMemberSubscription(member_id, subid, interval);
    return result.rows[0];
};

exports.removeSubscription = async ({ member_id, subid }) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const subCheck = await subscriptionRepository.checkMemberSubscription(member_id, subid);
    if (subCheck.rows.length === 0) {
        throw new Error("Subscription not found for this member");
    }

    await subscriptionRepository.removeMemberSubscription(member_id, subid);
};

// New billing-related services for members
exports.getBillingHistory = async (memberId) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${memberId}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const history = await subscriptionRepository.getBillingHistory(memberId);
    return history.rows;
};

// In subscriptionService.js
exports.processPayment = async ({ member_id, subscription_id, payment_amount, payment_method }) => {
    // Verify member exists
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    // Verify subscription exists
    const subscription = await subscriptionRepository.checkMemberSubscription(member_id);
    if (subscription.rows.length === 0) {
        throw new Error("Member has no subscription");
    }

    // Process the payment record
    const result = await subscriptionRepository.addBillingRecord(
        subscription_id, 
        payment_amount, 
        payment_method
    );
    
    return result.rows[0];
};

exports.renewSubscription = async ({ member_id, subid }) => {
    // Verify member exists
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${member_id}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    // Get subscription type for duration
    const subResult = await subscriptionRepository.getSubscriptionType(subid);
    if (subResult.rows.length === 0) {
        throw new Error("Subscription type not found");
    }

    // Calculate new duration
    const { duration } = subResult.rows[0];
    let interval = "";
    if (duration.months) {
        interval = `${duration.months} months`;
    } else if (duration.years) {
        interval = `${duration.years} years`;
    }

    // Renew the subscription
    const result = await subscriptionRepository.updateMemberSubscription(member_id, subid, interval);
    return result.rows[0];
};

exports.getCurrentSubscription = async (memberId) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${memberId}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const subscription = await subscriptionRepository.getCurrentMemberSubscription(memberId);
    if (subscription.rows.length === 0) {
        return null;
    }

    const subType = await subscriptionRepository.getSubscriptionType(subscription.rows[0].subid);
    return {
        ...subscription.rows[0],
        subscriptionDetails: subType.rows[0]
    };
};

exports.getNextBillingDate = async (memberId) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${memberId}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const subscription = await subscriptionRepository.getCurrentMemberSubscription(memberId);
    if (subscription.rows.length === 0) {
        throw new Error("No active subscription found");
    }

    return {
        nextBillingDate: subscription.rows[0].end_date,
        isAutoRenew: subscription.rows[0].auto_renew
    };
};

exports.toggleAutoRenewal = async (memberId, autoRenew) => {
    const memberResponse = await axios.get(`${MEMBER_API_BASE_URL}/members/${memberId}`);
    if (!memberResponse.data) {
        throw new Error("Member not found");
    }

    const result = await subscriptionRepository.updateAutoRenewal(memberId, autoRenew);
    return result.rows[0];
};
