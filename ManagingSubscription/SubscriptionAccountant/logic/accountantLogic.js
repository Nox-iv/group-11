const axios = require("axios");
const accountantRepository = require("../repo/accountantRepo");

const MEMBER_API_BASE_URL = "http://localhost:3002";

exports.getMemberSubscriptionList = async () => {
    const memberSubList = await accountantRepository.getMemberSubscriptionList();
    return memberSubList.rows;
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
