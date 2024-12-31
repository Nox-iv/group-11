// wishlistRepo.test.js
const { Pool } = require('pg');
const wishlistRepo = require('./wishlistRepo');

// Mock the pg Pool
jest.mock('pg', () => {
    const mockPool = {
        query: jest.fn(),
    };
    return { Pool: jest.fn(() => mockPool) };
});

// Get the mock pool instance
const pool = new Pool();

describe('Wishlist Repository Tests', () => {
    // Clear mock data before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createWishlist', () => {
        it('should create a wishlist with given name and member_id', async () => {
            // Prepare mock data that we expect to get back from database
            const mockWishlist = {
                rows: [{
                    id: 1,
                    name: 'My Reading List',
                    member_id: 123
                }]
            };

            // Setup the mock to return our data
            pool.query.mockResolvedValue(mockWishlist);

            // Call the repository function
            const result = await wishlistRepo.createWishlist('My Reading List', 123);

            // Verify the query was called with correct SQL and parameters
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO wishlists (name, member_id) VALUES ($1, $2) RETURNING *',
                ['My Reading List', 123]
            );

            // Verify we got back what we expected
            expect(result).toEqual(mockWishlist);
        });
    });

    describe('getWishlistById', () => {
        it('should fetch wishlist details by id', async () => {
            const mockResult = {
                rows: [{
                    name: 'My Reading List',
                    member_id: 123
                }]
            };

            pool.query.mockResolvedValue(mockResult);

            const result = await wishlistRepo.getWishlistById(1);

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT name, member_id FROM wishlists WHERE id = $1',
                [1]
            );
            expect(result).toEqual(mockResult);
        });

        it('should return empty rows for non-existent wishlist', async () => {
            const mockResult = { rows: [] };
            pool.query.mockResolvedValue(mockResult);

            const result = await wishlistRepo.getWishlistById(999);

            expect(result.rows).toHaveLength(0);
        });
    });

    describe('addMediaToWishlist', () => {
        it('should add media item to wishlist', async () => {
            const mockResult = {
                rows: [{
                    id: 1,
                    wishlist_id: 1,
                    wishlist_name: 'My List',
                    member_id: 123,
                    member_name: 'John Doe',
                    media_id: 456
                }]
            };

            pool.query.mockResolvedValue(mockResult);

            const result = await wishlistRepo.addMediaToWishlist(
                1, 'My List', 123, 'John Doe', 456
            );

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO wishlist_items (wishlist_id, wishlist_name, member_id, member_name, media_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [1, 'My List', 123, 'John Doe', 456]
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe('getAllWishlists', () => {
        it('should fetch all wishlists', async () => {
            const mockWishlists = {
                rows: [
                    { id: 1, name: 'List 1', member_id: 123 },
                    { id: 2, name: 'List 2', member_id: 456 }
                ]
            };

            pool.query.mockResolvedValue(mockWishlists);

            const result = await wishlistRepo.getAllWishlists();

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM wishlists'
            );
            expect(result).toEqual(mockWishlists);
        });
    });
});