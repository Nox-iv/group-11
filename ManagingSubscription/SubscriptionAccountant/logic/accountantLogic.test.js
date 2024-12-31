const axios = require('axios');
const accountantLogic = require('./accountantLogic');
const accountantRepository = require('../repo/accountantRepo');

// Mock dependencies
jest.mock('axios');
jest.mock('../repo/accountantRepo');

describe('Accountant Logic Tests', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMemberSubscriptionList', () => {
        it('should successfully enrich subscription list with member names', async () => {
            // Mock repository response
            const mockSubList = {
                rows: [
                    { member_id: 1, subscription_type: 'premium' },
                    { member_id: 2, subscription_type: 'basic' }
                ]
            };
            accountantRepository.getMemberSubscriptionList.mockResolvedValue(mockSubList);

            // Mock axios responses for member data
            axios.get.mockImplementation((url) => {
                const memberId = url.split('/').pop();
                return Promise.resolve({
                    data: {
                        firstName: `FirstName${memberId}`,
                        lastName: `LastName${memberId}`
                    }
                });
            });

            const result = await accountantLogic.getMemberSubscriptionList();

            expect(result).toHaveLength(2);
            expect(result[0].member_name).toBe('FirstName1 LastName1');
            expect(result[1].member_name).toBe('FirstName2 LastName2');
            expect(accountantRepository.getMemberSubscriptionList).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledTimes(2);
        });

        it('should handle failed member API calls gracefully', async () => {
            // Mock repository response
            const mockSubList = {
                rows: [{ member_id: 1, subscription_type: 'premium' }]
            };
            accountantRepository.getMemberSubscriptionList.mockResolvedValue(mockSubList);

            // Mock axios to fail
            axios.get.mockRejectedValue(new Error('API Error'));

            const result = await accountantLogic.getMemberSubscriptionList();

            expect(result).toHaveLength(1);
            expect(result[0].member_name).toBe('Name Not Available');
        });
    });

    describe('updateMemberSubscription', () => {
        it('should successfully update subscription with monthly duration', async () => {
            // Mock successful member API response
            axios.get.mockResolvedValue({
                data: { firstName: 'John', lastName: 'Doe' }
            });

            // Mock subscription type lookup
            accountantRepository.getSubscriptionType.mockResolvedValue({
                rows: [{ duration: { months: 1 } }]
            });

            // Mock update operation
            accountantRepository.updateMemberSubscription.mockResolvedValue({
                rows: [{ member_id: 1, subscription_type: 'premium' }]
            });

            const result = await accountantLogic.updateMemberSubscription({
                member_id: 1,
                new_subid: 'premium'
            });

            expect(result).toBeDefined();
            expect(accountantRepository.updateMemberSubscription)
                .toHaveBeenCalledWith('premium', '1 months', 1);
        });

        it('should throw error when member not found', async () => {
            axios.get.mockResolvedValue({ data: null });

            await expect(accountantLogic.updateMemberSubscription({
                member_id: 999,
                new_subid: 'premium'
            })).rejects.toThrow('Member not found');
        });

        it('should throw error when subscription type not found', async () => {
            axios.get.mockResolvedValue({
                data: { firstName: 'John', lastName: 'Doe' }
            });

            accountantRepository.getSubscriptionType.mockResolvedValue({ rows: [] });

            await expect(accountantLogic.updateMemberSubscription({
                member_id: 1,
                new_subid: 'invalid'
            })).rejects.toThrow('Subscription type not found');
        });
    });

    describe('getBillingHistory', () => {
        it('should return billing history for valid subscription', async () => {
            accountantRepository.getMemberSubscriptionById.mockResolvedValue({
                rows: [{ subscription_id: 1 }]
            });

            const mockBillingHistory = {
                rows: [
                    { billing_id: 1, amount: 100 },
                    { billing_id: 2, amount: 200 }
                ]
            };
            accountantRepository.getBillingHistory.mockResolvedValue(mockBillingHistory);

            const result = await accountantLogic.getBillingHistory(1);

            expect(result).toEqual(mockBillingHistory.rows);
            expect(accountantRepository.getBillingHistory).toHaveBeenCalledWith(1);
        });

        it('should throw error for invalid subscription', async () => {
            accountantRepository.getMemberSubscriptionById.mockResolvedValue({ rows: [] });

            await expect(accountantLogic.getBillingHistory(999))
                .rejects.toThrow('Subscription not found');
        });
    });

    describe('updateBillingStatus', () => {
        it('should successfully update billing status', async () => {
            accountantRepository.getBillingById.mockResolvedValue({
                rows: [{ billing_id: 1 }]
            });

            const mockUpdatedBilling = {
                rows: [{ billing_id: 1, status: 'paid' }]
            };
            accountantRepository.updateBillingStatus.mockResolvedValue(mockUpdatedBilling);

            const result = await accountantLogic.updateBillingStatus(1, 'paid');

            expect(result).toEqual(mockUpdatedBilling.rows[0]);
            expect(accountantRepository.updateBillingStatus)
                .toHaveBeenCalledWith(1, 'paid');
        });

        it('should throw error for invalid billing record', async () => {
            accountantRepository.getBillingById.mockResolvedValue({ rows: [] });

            await expect(accountantLogic.updateBillingStatus(999, 'paid'))
                .rejects.toThrow('Billing record not found');
        });
    });

    describe('getSubscriptionWithBilling', () => {
        it('should return subscription with billing details', async () => {
            const mockSubscription = {
                rows: [{
                    subscription_id: 1,
                    billing_status: 'active',
                    total_amount: 500
                }]
            };
            accountantRepository.getSubscriptionWithBilling.mockResolvedValue(mockSubscription);

            const result = await accountantLogic.getSubscriptionWithBilling(1);

            expect(result).toEqual(mockSubscription.rows[0]);
            expect(accountantRepository.getSubscriptionWithBilling)
                .toHaveBeenCalledWith(1);
        });

        it('should throw error for non-existent subscription', async () => {
            accountantRepository.getSubscriptionWithBilling.mockResolvedValue({ rows: [] });

            await expect(accountantLogic.getSubscriptionWithBilling(999))
                .rejects.toThrow('Subscription not found');
        });
    });
});