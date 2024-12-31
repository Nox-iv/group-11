// wishlistLogic.test.js
const axios = require('axios');
const wishlistLogic = require('./wishlistLogic');
const wishlistRepository = require('../repositories/wishlistRepo');

// Mock the repository and axios
jest.mock('../repositories/wishlistRepo');
jest.mock('axios');

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe('Wishlist Logic Tests', () => {
    // Test createWishlist function
    describe('createWishlist', () => {
        it('should create a wishlist successfully', async () => {
            // Prepare test data
            const mockWishlist = {
                id: 1,
                name: 'My Reading List',
                member_id: 123
            };
            
            // Setup repository mock
            wishlistRepository.createWishlist.mockResolvedValue({
                rows: [mockWishlist]
            });

            // Execute the function
            const result = await wishlistLogic.createWishlist({
                wishlistName: 'My Reading List',
                member_id: 1
            });

            // Verify the results
            expect(result).toEqual(mockWishlist);
            expect(wishlistRepository.createWishlist).toHaveBeenCalledWith(
                'My Reading List',
                1
            );
        });
    });

    // Test addMediaToWishlist function
    describe('addMediaToWishlist', () => {
        it('should add media to wishlist when all checks pass', async () => {
            // Mock data
            const mediaResponse = {
                data: { id: 1, title: 'Test Media' }
            };
            const wishlistResponse = {
                rows: [{
                    id: 1,
                    name: 'My Wishlist',
                    member_id: 123
                }]
            };
            const memberResponse = {
                data: { member_name: 'John Doe' }
            };
            const newItemResponse = {
                rows: [{
                    id: 1,
                    wishlist_id: 1,
                    media_id: 1
                }]
            };

            // Setup mocks
            axios.get.mockImplementation((url) => {
                if (url.includes('media')) return Promise.resolve(mediaResponse);
                if (url.includes('members')) return Promise.resolve(memberResponse);
            });
            wishlistRepository.getWishlistById.mockResolvedValue(wishlistResponse);
            wishlistRepository.addMediaToWishlist.mockResolvedValue(newItemResponse);

            // Execute
            const result = await wishlistLogic.addMediaToWishlist(1, { media_id: 1 });

            // Verify
            expect(result).toEqual(newItemResponse.rows[0]);
            expect(axios.get).toHaveBeenCalledTimes(2);
            expect(wishlistRepository.addMediaToWishlist).toHaveBeenCalled();
        });

        it('should throw error when media not found', async () => {
            // Mock failed media response
            axios.get.mockRejectedValueOnce(new Error('Media not found'));

            // Execute and verify
            await expect(
                wishlistLogic.addMediaToWishlist(1, { media_id: 999 })
            ).rejects.toThrow('Media not found');
        });

        it('should throw error when wishlist not found', async () => {
            // Mock successful media response but failed wishlist lookup
            axios.get.mockResolvedValueOnce({ data: { id: 1 } });
            wishlistRepository.getWishlistById.mockResolvedValue({ rows: [] });

            // Execute and verify
            await expect(
                wishlistLogic.addMediaToWishlist(999, { media_id: 1 })
            ).rejects.toThrow('Wishlist not found');
        });
    });

    // Test removeMediaFromWishlist function
    describe('removeMediaFromWishlist', () => {
        it('should remove media successfully', async () => {
            // Mock successful removal
            wishlistRepository.removeMediaFromWishlist.mockResolvedValue({
                rowCount: 1
            });

            const result = await wishlistLogic.removeMediaFromWishlist(1, 1);
            expect(result).toBe('Media removed from wishlist');
        });

        it('should throw error when item not found', async () => {
            // Mock no rows affected
            wishlistRepository.removeMediaFromWishlist.mockResolvedValue({
                rowCount: 0
            });

            await expect(
                wishlistLogic.removeMediaFromWishlist(1, 999)
            ).rejects.toThrow('Item not found');
        });
    });

    describe('deleteWishlist', () => {
        it('should delete wishlist and its items successfully', async () => {
            wishlistRepository.deleteWishlistItems.mockResolvedValue();
            wishlistRepository.deleteWishlist.mockResolvedValue();
    
            await wishlistLogic.deleteWishlist(1);
    
            expect(wishlistRepository.deleteWishlistItems).toHaveBeenCalledWith(1);
            expect(wishlistRepository.deleteWishlist).toHaveBeenCalledWith(1);
        });
    });
    
        // Test getAllWishlists function
    describe('getAllWishlists', () => {
        it('should return all wishlists', async () => {
            const mockWishlists = {
                rows: [
                    { id: 1, name: 'List 1' },
                    { id: 2, name: 'List 2' }
                ]
            };

            wishlistRepository.getAllWishlists.mockResolvedValue(mockWishlists);

            const result = await wishlistLogic.getAllWishlists();

            expect(result).toEqual(mockWishlists.rows);
            expect(wishlistRepository.getAllWishlists).toHaveBeenCalled();
        });

        it('should return empty array when no wishlists exist', async () => {
            wishlistRepository.getAllWishlists.mockResolvedValue({ rows: [] });

            const result = await wishlistLogic.getAllWishlists();

            expect(result).toEqual([]);
        });
    });
     
});