const pool = require('../db');
jest.mock('../db');

const normalizeSQL = (sql) => {
    return sql.replace(/\s+/g, ' ').trim();
};

describe('Accountant Repository Tests', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock the pool query method to return a default structure
        pool.query = jest.fn();
    });

    describe('getMemberSubscriptionList', () => {
        it('should fetch all member subscriptions with subscription type details', async () => {
            const expectedQuery = `
                SELECT ms.*, st.subtype, st.price
                FROM memberSubscription ms
                JOIN subscriptionType st ON ms.subid = st.subid
            `;
            const mockResult = {
                rows: [
                    { id: 1, member_id: 1, subid: 'premium', subtype: 'Premium', price: 99.99 },
                    { id: 2, member_id: 2, subid: 'basic', subtype: 'Basic', price: 49.99 }
                ]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').getMemberSubscriptionList();

            // Compare normalized SQL queries
            expect(normalizeSQL(pool.query.mock.calls[0][0]))
                .toBe(normalizeSQL(expectedQuery));
            expect(result).toEqual(mockResult);
        });
    });

    describe('getSubscriptionType', () => {
        it('should fetch subscription type details by subid', async () => {
            const subid = 'premium';
            const mockResult = {
                rows: [{ subid: 'premium', subtype: 'Premium', price: 99.99, duration: { months: 1 } }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').getSubscriptionType(subid);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM subscriptionType WHERE subid = $1",
                [subid]
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe('updateMemberSubscription', () => {
        it('should update subscription with correct interval calculation', async () => {
            const new_subid = 'premium';
            const interval = '1 months';
            const member_id = 1;
            const mockResult = {
                rows: [{ id: 1, subid: 'premium', member_id: 1 }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').updateMemberSubscription(new_subid, interval, member_id);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE memberSubscription'),
                [new_subid, member_id]
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe('getAllBillingRecords', () => {
        it('should fetch all billing records with related information', async () => {
            const expectedQuery = `
                SELECT sb.*, ms.member_id, st.subtype, st.price
                FROM subscriptionBilling sb
                JOIN memberSubscription ms ON sb.subscription_id = ms.id
                JOIN subscriptionType st ON ms.subid = st.subid
                ORDER BY sb.billing_date DESC
            `;
            const mockResult = {
                rows: [
                    { billing_id: 1, subscription_id: 1, member_id: 1, subtype: 'Premium', price: 99.99 },
                    { billing_id: 2, subscription_id: 2, member_id: 2, subtype: 'Basic', price: 49.99 }
                ]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').getAllBillingRecords();

            // Compare normalized SQL queries
            expect(normalizeSQL(pool.query.mock.calls[0][0]))
                .toBe(normalizeSQL(expectedQuery));
            expect(result).toEqual(mockResult);
        });
    });
    
    describe('updateBillingStatus', () => {
        it('should update billing status correctly', async () => {
            const billing_id = 1;
            const status = 'paid';
            const mockResult = {
                rows: [{ billing_id: 1, payment_status: 'paid' }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').updateBillingStatus(billing_id, status);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE subscriptionBilling'),
                [billing_id, status]
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe('getSubscriptionWithBilling', () => {
        it('should fetch subscription details with billing information', async () => {
            const subscription_id = 1;
            const expectedQuery = expect.stringContaining('SELECT ms.*, st.subtype, st.price');
            const mockResult = {
                rows: [{
                    id: 1,
                    member_id: 1,
                    subid: 'premium',
                    subtype: 'Premium',
                    price: 99.99,
                    billing_id: 1,
                    payment_status: 'pending'
                }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').getSubscriptionWithBilling(subscription_id);

            expect(pool.query).toHaveBeenCalledWith(expectedQuery, [subscription_id]);
            expect(result).toEqual(mockResult);
        });

        it('should handle subscriptions with no billing records', async () => {
            const subscription_id = 1;
            const mockResult = {
                rows: [{
                    id: 1,
                    member_id: 1,
                    subid: 'premium',
                    subtype: 'Premium',
                    price: 99.99,
                    billing_id: null,
                    payment_status: null
                }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').getSubscriptionWithBilling(subscription_id);

            expect(result.rows[0].billing_id).toBeNull();
            expect(result.rows[0].payment_status).toBeNull();
        });
    });

    describe('getMemberSubscriptionById', () => {
        it('should fetch subscription by id', async () => {
            const subscription_id = 1;
            const mockResult = {
                rows: [{ id: 1, member_id: 1, subid: 'premium' }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./accountantRepo').getMemberSubscriptionById(subscription_id);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM memberSubscription WHERE id = $1",
                [subscription_id]
            );
            expect(result).toEqual(mockResult);
        });
    });
});