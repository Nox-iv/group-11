const subscriptionService = require('../logic/subscriptionLogic');

// Mock the service layer
jest.mock('../logic/subscriptionLogic');

// Helper functions to create mock request and response objects
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (body = {}, params = {}) => ({
    body,
    params
});

describe('Subscription Controller Tests', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getSubscriptionTypes', () => {
        it('should return subscription types with 200 status when successful', async () => {
            // We create mock subscription types that the service would return
            const mockTypes = [
                { subid: 'basic', price: 9.99, duration: { months: 1 } },
                { subid: 'premium', price: 99.99, duration: { years: 1 } }
            ];
            subscriptionService.getSubscriptionTypes.mockResolvedValue(mockTypes);

            const req = mockRequest();
            const res = mockResponse();

            // Execute the controller method
            await require('./subscriptionController').getSubscriptionTypes(req, res);

            // Verify response handling
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTypes);
        });

        it('should handle errors with 500 status', async () => {
            // Simulate a service error
            subscriptionService.getSubscriptionTypes.mockRejectedValue(new Error('Database error'));

            const req = mockRequest();
            const res = mockResponse();

            await require('./subscriptionController').getSubscriptionTypes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('subscribeToLibrary', () => {
        it('should create subscription and return 201 status when successful', async () => {
            const subscribeData = {
                subid: 'basic',
                first_name: 'John',
                last_name: 'Doe',
                payment_method: 'credit_card'
            };
            const mockSubscription = {
                id: 1,
                member_id: 123,
                ...subscribeData
            };
            subscriptionService.subscribeToLibrary.mockResolvedValue(mockSubscription);

            const req = mockRequest(subscribeData);
            const res = mockResponse();

            await require('./subscriptionController').subscribeToLibrary(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSubscription);
            expect(subscriptionService.subscribeToLibrary).toHaveBeenCalledWith(subscribeData);
        });

        it('should include error details when subscription fails', async () => {
            const error = new Error('Invalid subscription type');
            subscriptionService.subscribeToLibrary.mockRejectedValue(error);

            const req = mockRequest({ subid: 'invalid' });
            const res = mockResponse();

            await require('./subscriptionController').subscribeToLibrary(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Server error',
                details: error.message
            });
        });
    });

    describe('getMemberSubscription', () => {
        it('should return current subscription with 200 status', async () => {
            const mockSubscription = {
                id: 1,
                member_id: '123',
                subid: 'premium',
                subscriptionDetails: { price: 99.99 }
            };
            subscriptionService.getCurrentSubscription.mockResolvedValue(mockSubscription);

            const req = mockRequest({}, { memberId: '123' });
            const res = mockResponse();

            await require('./subscriptionController').getMemberSubscription(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSubscription);
            expect(subscriptionService.getCurrentSubscription).toHaveBeenCalledWith('123');
        });
    });

    describe('processPayment', () => {
        it('should process payment and return 200 status when successful', async () => {
            const paymentData = {
                member_id: '123',
                subscription_id: 1,
                payment_amount: 99.99,
                payment_method: 'credit_card'
            };
            const mockPayment = { billing_id: 1, ...paymentData, status: 'completed' };
            subscriptionService.processPayment.mockResolvedValue(mockPayment);

            const req = mockRequest(paymentData);
            const res = mockResponse();

            await require('./subscriptionController').processPayment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockPayment);
            expect(subscriptionService.processPayment).toHaveBeenCalledWith(paymentData);
        });
    });

    describe('toggleAutoRenewal', () => {
        it('should update auto-renewal setting and return 200 status', async () => {
            const updateData = { memberId: '123', autoRenew: true };
            const mockResult = { ...updateData, updated_at: new Date() };
            subscriptionService.toggleAutoRenewal.mockResolvedValue(mockResult);

            const req = mockRequest(updateData);
            const res = mockResponse();

            await require('./subscriptionController').toggleAutoRenewal(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
            expect(subscriptionService.toggleAutoRenewal)
                .toHaveBeenCalledWith('123', true);
        });
    });

    describe('removeSubscription', () => {
        it('should remove subscription and return success message with 200 status', async () => {
            const removalData = { member_id: '123', subid: 'premium' };
            subscriptionService.removeSubscription.mockResolvedValue();

            const req = mockRequest(removalData);
            const res = mockResponse();

            await require('./subscriptionController').removeSubscription(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Subscription removed successfully'
            });
            expect(subscriptionService.removeSubscription).toHaveBeenCalledWith(removalData);
        });
    });

    describe('getBillingHistory', () => {
        it('should return billing history with 200 status', async () => {
            const mockHistory = [
                { billing_id: 1, amount: 99.99, date: '2024-01-01' },
                { billing_id: 2, amount: 99.99, date: '2024-02-01' }
            ];
            subscriptionService.getBillingHistory.mockResolvedValue(mockHistory);

            const req = mockRequest({}, { memberId: '123' });
            const res = mockResponse();

            await require('./subscriptionController').getBillingHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockHistory);
            expect(subscriptionService.getBillingHistory).toHaveBeenCalledWith('123');
        });
    });
});