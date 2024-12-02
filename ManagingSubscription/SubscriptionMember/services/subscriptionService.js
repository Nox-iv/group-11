const axios = require("axios");
const subscriptionRepository = require("../repo/subscriptionRepo.js");

const MEMBER_API_BASE_URL = "http://localhost:3002";

exports.getSubscriptionList = async () => {
    const subscriptionList = await subscriptionRepository.getSubscriptionList();
    return subscriptionList.rows;
};

exports.subscribeToLibrary = async ({ member_id, subid }) => {
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

    const result = await subscriptionRepository.createMemberSubscription(member_id, subid, interval);
    return result.rows[0];
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
