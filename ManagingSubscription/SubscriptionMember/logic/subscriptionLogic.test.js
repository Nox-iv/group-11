const axios = require('axios');
const subscriptionLogic = require('./subscriptionLogic');
const subscriptionRepository = require('../repo/subscriptionRepo');

// Mock external dependencies
jest.mock('axios');
jest.mock('../repo/subscriptionRepo');

describe('Subscription Logic Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSubscriptionTypes', () => {
        it('should return all available subscription types', async () => {
            const mockTypes = {
                rows: [
                    { subid: 'basic', price: 9.99, duration: { months: 1 } },
                    { subid: 'premium', price: 99.99, duration: { years: 1 } }
                ]
            };
            subscriptionRepository.getSubscriptionTypes.mockResolvedValue(mockTypes);

            const result = await subscriptionLogic.getSubscriptionTypes();

            expect(result).toEqual(mockTypes.rows);
            expect(subscriptionRepository.getSubscriptionTypes).toHaveBeenCalledTimes(1);
        });
    });

    describe('subscribeToLibrary', () => {
        it('should create new subscription with monthly duration', async () => {
            const subscribeData = {
                subid: 'basic',
                first_name: 'John',
                last_name: 'Doe',
                payment_method: 'credit_card'
            };

            // Mock subscription type lookup
            subscriptionRepository.getSubscriptionType.mockResolvedValue({
                rows: [{ duration: { months: 1 }, price: 9.99 }]
            });

            // Mock subscription creation
            const mockSubscription = {
                rows: [{ id: 1, member_id: 123, subid: 'basic' }]
            };
            subscriptionRepository.createMemberSubscription.mockResolvedValue(mockSubscription);
            subscriptionRepository.addBillingRecord.mockResolvedValue({ rows: [{ billing_id: 1 }] });

            const result = await subscriptionLogic.subscribeToLibrary(subscribeData);

            expect(result).toEqual(mockSubscription.rows[0]);
            expect(subscriptionRepository.createMemberSubscription)
                .toHaveBeenCalledWith(
                    expect.any(Number),
                    'basic',
                    '1 months',
                    'John',
                    'Doe'
                );
            expect(subscriptionRepository.addBillingRecord).toHaveBeenCalledTimes(1);
        });

        it('should throw error for invalid subscription type', async () => {
            subscriptionRepository.getSubscriptionType.mockResolvedValue({ rows: [] });

            await expect(subscriptionLogic.subscribeToLibrary({
                subid: 'invalid',
                first_name: 'John',
                last_name: 'Doe',
                payment_method: 'credit_card'
            })).rejects.toThrow('Subscription type not found');
        });
    });

    describe('updateSubscription', () => {
        it('should successfully update subscription', async () => {
            // Mock successful member verification
            axios.get.mockResolvedValue({ data: { id: 1, name: 'John Doe' } });

            // Mock subscription type lookup
            subscriptionRepository.getSubscriptionType.mockResolvedValue({
                rows: [{ duration: { months: 1 } }]
            });

            // Mock update operation
            const mockUpdated = {
                rows: [{ member_id: 1, subid: 'premium' }]
            };
            subscriptionRepository.updateMemberSubscription.mockResolvedValue(mockUpdated);

            const result = await subscriptionLogic.updateSubscription({
                member_id: 1,
                subid: 'premium'
            });

            expect(result).toEqual(mockUpdated.rows[0]);
            expect(subscriptionRepository.updateMemberSubscription)
                .toHaveBeenCalledWith(1, 'premium', '1 months');
        });

        it('should handle non-existent member', async () => {
            axios.get.mockResolvedValue({ data: null });

            await expect(subscriptionLogic.updateSubscription({
                member_id: 999,
                subid: 'premium'
            })).rejects.toThrow('Member not found');
        });
    });

    describe('getCurrentSubscription', () => {
        it('should return enriched subscription details for active subscription', async () => {
            // Mock member verification
            axios.get.mockResolvedValue({ data: { id: 1 } });

            // Mock current subscription lookup
            const mockSubscription = {
                rows: [{ member_id: 1, subid: 'premium' }]
            };
            subscriptionRepository.getCurrentMemberSubscription.mockResolvedValue(mockSubscription);

            // Mock subscription type details
            const mockSubType = {
                rows: [{ subid: 'premium', price: 99.99, features: ['unlimited'] }]
            };
            subscriptionRepository.getSubscriptionType.mockResolvedValue(mockSubType);

            const result = await subscriptionLogic.getCurrentSubscription(1);

            expect(result).toEqual({
                ...mockSubscription.rows[0],
                subscriptionDetails: mockSubType.rows[0]
            });
        });

        it('should return null for member without subscription', async () => {
            axios.get.mockResolvedValue({ data: { id: 1 } });
            subscriptionRepository.getCurrentMemberSubscription.mockResolvedValue({ rows: [] });

            const result = await subscriptionLogic.getCurrentSubscription(1);

            expect(result).toBeNull();
        });
    });

    describe('processPayment', () => {
        it('should successfully process payment for valid subscription', async () => {
            const paymentData = {
                member_id: 1,
                subscription_id: 1,
                payment_amount: 99.99,
                payment_method: 'credit_card'
            };

            axios.get.mockResolvedValue({ data: { id: 1 } });
            subscriptionRepository.checkMemberSubscription.mockResolvedValue({ rows: [{ id: 1 }] });
            subscriptionRepository.addBillingRecord.mockResolvedValue({
                rows: [{ billing_id: 1, ...paymentData }]
            });

            const result = await subscriptionLogic.processPayment(paymentData);

            expect(result).toBeDefined();
            expect(subscriptionRepository.addBillingRecord)
                .toHaveBeenCalledWith(1, 99.99, 'credit_card');
        });
    });

    describe('toggleAutoRenewal', () => {
        it('should successfully toggle auto-renewal status', async () => {
            axios.get.mockResolvedValue({ data: { id: 1 } });
            const mockResult = {
                rows: [{ member_id: 1, auto_renew: true }]
            };
            subscriptionRepository.updateAutoRenewal.mockResolvedValue(mockResult);

            const result = await subscriptionLogic.toggleAutoRenewal(1, true);

            expect(result).toEqual(mockResult.rows[0]);
            expect(subscriptionRepository.updateAutoRenewal)
                .toHaveBeenCalledWith(1, true);
        });
    });

    describe('getNextBillingDate', () => {
        it('should return next billing date and auto-renew status', async () => {
            axios.get.mockResolvedValue({ data: { id: 1 } });
            subscriptionRepository.getCurrentMemberSubscription.mockResolvedValue({
                rows: [{ end_date: '2024-12-31', auto_renew: true }]
            });

            const result = await subscriptionLogic.getNextBillingDate(1);

            expect(result).toEqual({
                nextBillingDate: '2024-12-31',
                isAutoRenew: true
            });
        });

        it('should throw error when no active subscription exists', async () => {
            axios.get.mockResolvedValue({ data: { id: 1 } });
            subscriptionRepository.getCurrentMemberSubscription.mockResolvedValue({ rows: [] });

            await expect(subscriptionLogic.getNextBillingDate(1))
                .rejects.toThrow('No active subscription found');
        });
    });
});