const accountantLogic = require('../logic/accountantLogic');
jest.mock('../logic/accountantLogic');

// Mock Express request and response objects
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

describe('Accountant Controller Tests', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getMemberSubscriptionList', () => {
        it('should successfully return subscription list with 200 status', async () => {
            // Given: A successful response from the logic layer
            const mockSubscriptions = [
                { id: 1, member_name: 'John Doe', subscription_type: 'premium' },
                { id: 2, member_name: 'Jane Smith', subscription_type: 'basic' }
            ];
            accountantLogic.getMemberSubscriptionList.mockResolvedValue(mockSubscriptions);

            const req = mockRequest();
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').getMemberSubscriptionList(req, res);

            // Then: Should respond with success status and data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSubscriptions);
            expect(accountantLogic.getMemberSubscriptionList).toHaveBeenCalledTimes(1);
        });

        it('should handle errors with 500 status and error message', async () => {
            // Given: An error occurs in the logic layer
            const error = new Error('Database error');
            accountantLogic.getMemberSubscriptionList.mockRejectedValue(error);

            const req = mockRequest();
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').getMemberSubscriptionList(req, res);

            // Then: Should respond with error status and message
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('updateMemberSubscription', () => {
        it('should successfully update subscription with 200 status', async () => {
            // Given: Update data and successful response
            const updateData = { member_id: 1, new_subid: 'premium' };
            const mockResult = { 
                id: 1, 
                member_id: 1, 
                subscription_type: 'premium',
                start_date: new Date()
            };
            accountantLogic.updateMemberSubscription.mockResolvedValue(mockResult);

            const req = mockRequest(updateData);
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').updateMemberSubscription(req, res);

            // Then: Should respond with success status and updated data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
            expect(accountantLogic.updateMemberSubscription).toHaveBeenCalledWith(updateData);
        });

        it('should include error details in response when update fails', async () => {
            // Given: An error occurs during update
            const error = new Error('Invalid subscription type');
            accountantLogic.updateMemberSubscription.mockRejectedValue(error);

            const req = mockRequest({ member_id: 1, new_subid: 'invalid' });
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').updateMemberSubscription(req, res);

            // Then: Should respond with error status and detailed message
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Server error',
                details: 'Invalid subscription type'
            });
        });
    });

    describe('getBillingHistory', () => {
        it('should return billing history for valid subscription ID', async () => {
            // Given: A subscription ID and mock billing history
            const subscriptionId = '123';
            const mockHistory = [
                { billing_id: 1, amount: 99.99, status: 'paid' },
                { billing_id: 2, amount: 99.99, status: 'pending' }
            ];
            accountantLogic.getBillingHistory.mockResolvedValue(mockHistory);

            const req = mockRequest({}, { subscriptionId });
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').getBillingHistory(req, res);

            // Then: Should respond with success status and history data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockHistory);
            expect(accountantLogic.getBillingHistory).toHaveBeenCalledWith(subscriptionId);
        });
    });

    describe('updateBillingStatus', () => {
        it('should successfully update billing status', async () => {
            // Given: Billing ID, new status, and mock response
            const billingId = '123';
            const status = 'paid';
            const mockUpdated = { billing_id: '123', status: 'paid', update_date: new Date() };
            accountantLogic.updateBillingStatus.mockResolvedValue(mockUpdated);

            const req = mockRequest({ status }, { billingId });
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').updateBillingStatus(req, res);

            // Then: Should respond with success status and updated data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdated);
            expect(accountantLogic.updateBillingStatus).toHaveBeenCalledWith(billingId, status);
        });
    });

    describe('getAllBillingRecords', () => {
        it('should return all billing records with 200 status', async () => {
            // Given: Mock billing records
            const mockRecords = [
                { billing_id: 1, subscription_id: 1, amount: 99.99 },
                { billing_id: 2, subscription_id: 2, amount: 49.99 }
            ];
            accountantLogic.getAllBillingRecords.mockResolvedValue(mockRecords);

            const req = mockRequest();
            const res = mockResponse();

            // When: The controller method is called
            await require('./accountantController').getAllBillingRecords(req, res);

            // Then: Should respond with success status and records
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRecords);
            expect(accountantLogic.getAllBillingRecords).toHaveBeenCalledTimes(1);
        });
    });
});