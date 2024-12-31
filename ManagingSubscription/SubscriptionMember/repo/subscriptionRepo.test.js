const pool = require('../db');
jest.mock('../db');

describe('Subscription Repository Tests', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Set up a default mock for the pool query method
        pool.query = jest.fn();
    });

    // Helper function to normalize SQL for consistent comparison
    const normalizeSQL = (sql) => {
        return sql.replace(/\s+/g, ' ').trim();
    };

    describe('getSubscriptionTypes', () => {
        it('should fetch all subscription types with correct fields', async () => {
            // Create a mock successful response
            const mockTypes = {
                rows: [
                    { subid: 'basic', subtype: 'Basic', price: 9.99, duration: { months: 1 } },
                    { subid: 'premium', subtype: 'Premium', price: 99.99, duration: { years: 1 } }
                ]
            };
            pool.query.mockResolvedValue(mockTypes);

            const expectedQuery = "SELECT subid, subtype, price, duration FROM subscriptionType";

            const result = await require('./subscriptionRepo').getSubscriptionTypes();

            expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(normalizeSQL(expectedQuery));
            expect(result).toEqual(mockTypes);
        });

        it('should propagate database errors', async () => {
            const dbError = new Error('Database connection failed');
            pool.query.mockRejectedValue(dbError);

            await expect(require('./subscriptionRepo').getSubscriptionTypes())
                .rejects.toThrow('Database connection failed');
        });
    });

    describe('createMemberSubscription', () => {
        it('should create subscription with correct interval calculation', async () => {
            const mockSubscription = {
                rows: [{
                    id: 1,
                    member_id: 123,
                    subid: 'premium',
                    first_name: 'John',
                    last_name: 'Doe'
                }]
            };
            pool.query.mockResolvedValue(mockSubscription);

            const result = await require('./subscriptionRepo').createMemberSubscription(
                123, 'premium', '1 month', 'John', 'Doe'
            );

            // Verify the query includes INTERVAL calculation and all required fields
            expect(pool.query.mock.calls[0][0]).toContain('INTERVAL');
            expect(pool.query.mock.calls[0][0]).toContain('member_id');
            expect(pool.query.mock.calls[0][0]).toContain('first_name');
            expect(pool.query.mock.calls[0][0]).toContain('last_name');
            
            // Verify parameters are passed in correct order
            expect(pool.query.mock.calls[0][1]).toEqual([123, 'premium', 'John', 'Doe']);
            expect(result).toEqual(mockSubscription);
        });
    });

    describe('getCurrentMemberSubscription', () => {
        it('should fetch current subscription with all related details', async () => {
            const memberId = 123;
            const expectedQuery = `
                SELECT ms.*, st.subtype, st.price, st.duration,
                    sb.payment_status, sb.payment_method, sb.billing_date
                FROM memberSubscription ms
                JOIN subscriptionType st ON ms.subid = st.subid
                LEFT JOIN subscriptionBilling sb ON sb.subscription_id = ms.id
                WHERE ms.member_id = $1 
                AND ms.end_date > CURRENT_TIMESTAMP
                ORDER BY ms.start_date DESC 
                LIMIT 1
            `;

            const mockResult = {
                rows: [{
                    id: 1,
                    member_id: memberId,
                    subid: 'premium',
                    subtype: 'Premium',
                    price: 99.99,
                    payment_status: 'paid'
                }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./subscriptionRepo').getCurrentMemberSubscription(memberId);

            expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(normalizeSQL(expectedQuery));
            expect(pool.query.mock.calls[0][1]).toEqual([memberId]);
            expect(result).toEqual(mockResult);
        });
    });

    describe('getBillingHistory', () => {
        it('should fetch complete billing history with subscription details', async () => {
            const memberId = 123;
            const expectedQuery = normalizeSQL(`
                SELECT sb.*, ms.start_date, ms.end_date, st.subtype, st.price
                FROM subscriptionBilling sb
                JOIN memberSubscription ms ON sb.subscription_id = ms.id
                JOIN subscriptionType st ON ms.subid = st.subid
                WHERE ms.member_id = $1
                ORDER BY sb.billing_date DESC
            `);

            const mockHistory = {
                rows: [
                    { billing_id: 1, payment_amount: 99.99, payment_status: 'paid' },
                    { billing_id: 2, payment_amount: 99.99, payment_status: 'pending' }
                ]
            };
            pool.query.mockResolvedValue(mockHistory);

            const result = await require('./subscriptionRepo').getBillingHistory(memberId);

            expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(expectedQuery);
            expect(pool.query.mock.calls[0][1]).toEqual([memberId]);
            expect(result).toEqual(mockHistory);
        });
    });

    describe('updateAutoRenewal', () => {
        it('should update auto-renewal status for current subscription', async () => {
            const memberId = 123;
            const autoRenew = true;
            
            const expectedQuery = normalizeSQL(`
                UPDATE memberSubscription 
                SET auto_renew = $2
                WHERE member_id = $1 
                AND end_date > CURRENT_TIMESTAMP
                RETURNING *
            `);

            const mockResult = {
                rows: [{
                    member_id: memberId,
                    auto_renew: true,
                    end_date: '2024-12-31'
                }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./subscriptionRepo').updateAutoRenewal(memberId, autoRenew);

            expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(expectedQuery);
            expect(pool.query.mock.calls[0][1]).toEqual([memberId, autoRenew]);
            expect(result).toEqual(mockResult);
        });
    });

    describe('addBillingRecord', () => {
        it('should create new billing record with all required fields', async () => {
            const billingData = {
                subscription_id: 1,
                payment_amount: 99.99,
                payment_method: 'credit_card',
                payment_status: 'pending'
            };

            const mockResult = {
                rows: [{ billing_id: 1, ...billingData }]
            };
            pool.query.mockResolvedValue(mockResult);

            const result = await require('./subscriptionRepo').addBillingRecord(
                billingData.subscription_id,
                billingData.payment_amount,
                billingData.payment_method,
                billingData.payment_status
            );

            // Verify the INSERT query contains all necessary fields
            expect(pool.query.mock.calls[0][0]).toContain('subscription_id');
            expect(pool.query.mock.calls[0][0]).toContain('payment_amount');
            expect(pool.query.mock.calls[0][0]).toContain('payment_method');
            expect(pool.query.mock.calls[0][0]).toContain('payment_status');

            // Verify parameters are passed correctly
            expect(pool.query.mock.calls[0][1]).toEqual([
                billingData.subscription_id,
                billingData.payment_amount,
                billingData.payment_method,
                billingData.payment_status
            ]);
            
            expect(result).toEqual(mockResult);
        });
    });
});