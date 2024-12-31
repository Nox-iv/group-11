// wishlistController.test.js
const wishlistController = require('./wishlistController');
const wishlistService = require('../logic/wishlistLogic');

// Mock the service layer
jest.mock('../logic/wishlistLogic');

describe('Wishlist Controller Tests', () => {
    // Create mock request and response objects before each test
    let mockRequest;
    let mockResponse;
    
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Create fresh mock request and response objects
        mockRequest = {
            body: {},
            params: {}
        };
        
        mockResponse = {
            status: jest.fn().mockReturnThis(), // Allow chaining .json()
            json: jest.fn()
        };
    });

    describe('createWishlist', () => {
        it('should create wishlist and return 201 status', async () => {
            // Prepare test data
            const wishlistData = {
                wishlistName: 'My Reading List',
                member_id: 123
            };
            const createdWishlist = {
                id: 1,
                name: 'My Reading List',
                member_id: 123
            };

            // Setup request data
            mockRequest.body = wishlistData;
            
            // Mock service response
            wishlistService.createWishlist.mockResolvedValue(createdWishlist);

            // Call controller function
            await wishlistController.createWishlist(mockRequest, mockResponse);

            // Verify response
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdWishlist);
            expect(wishlistService.createWishlist).toHaveBeenCalledWith(wishlistData);
        });

        it('should handle errors and return 500 status', async () => {
            // Mock service error
            const error = new Error('Database error');
            wishlistService.createWishlist.mockRejectedValue(error);

            // Call controller function
            await wishlistController.createWishlist(mockRequest, mockResponse);

            // Verify error handling
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Server error',
                details: error.message
            });
        });
    });

    describe('addMediaToWishlist', () => {
        it('should add media and return 201 status', async () => {
            // Prepare test data
            const wishlistId = '1';
            const mediaData = { media_id: 456 };
            const addedItem = {
                id: 1,
                wishlist_id: 1,
                media_id: 456
            };

            // Setup request data
            mockRequest.params.id = wishlistId;
            mockRequest.body = mediaData;
            
            // Mock service response
            wishlistService.addMediaToWishlist.mockResolvedValue(addedItem);

            // Call controller function
            await wishlistController.addMediaToWishlist(mockRequest, mockResponse);

            // Verify response
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(addedItem);
            expect(wishlistService.addMediaToWishlist).toHaveBeenCalledWith(
                wishlistId,
                mediaData
            );
        });

        it('should handle errors and return 500 status', async () => {
            wishlistService.addMediaToWishlist.mockRejectedValue(new Error());

            await wishlistController.addMediaToWishlist(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Server error'
            });
        });
    });

    
    describe('removeMediaFromWishlist', () => {
        it('should remove media and return success message', async () => {
            // Setup test parameters that would come from URL
            const wishlistId = '1';
            const mediaId = '123';
            mockRequest.params = { wishlistId, mediaId };

            // Mock the service to return a success message
            const successMessage = 'Media removed from wishlist';
            wishlistService.removeMediaFromWishlist.mockResolvedValue(successMessage);

            // Call the controller function
            await wishlistController.removeMediaFromWishlist(mockRequest, mockResponse);

            // Verify the controller handled everything correctly
            expect(wishlistService.removeMediaFromWishlist).toHaveBeenCalledWith(wishlistId, mediaId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: successMessage });
        });

        it('should handle errors during media removal', async () => {
            // Mock a failed removal attempt
            wishlistService.removeMediaFromWishlist.mockRejectedValue(new Error('Removal failed'));
            mockRequest.params = { wishlistId: '1', mediaId: '123' };

            await wishlistController.removeMediaFromWishlist(mockRequest, mockResponse);

            // Verify error handling
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('deleteWishlist', () => {
        it('should delete wishlist and return success message', async () => {
            // Setup wishlist ID in request params
            mockRequest.params = { id: '1' };

            // Call the controller function
            await wishlistController.deleteWishlist(mockRequest, mockResponse);

            // Verify the deletion was handled correctly
            expect(wishlistService.deleteWishlist).toHaveBeenCalledWith('1');
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Wishlist was deleted' });
        });

        it('should handle errors during wishlist deletion', async () => {
            // Mock a failed deletion
            wishlistService.deleteWishlist.mockRejectedValue(new Error('Deletion failed'));
            mockRequest.params = { id: '1' };

            await wishlistController.deleteWishlist(mockRequest, mockResponse);

            // Verify error response
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Server error' });
        });
    });

    describe('getAllWishlists', () => {
        it('should return all wishlists with 200 status', async () => {
            const mockWishlists = [
                { id: 1, name: 'List 1' },
                { id: 2, name: 'List 2' }
            ];

            wishlistService.getAllWishlists.mockResolvedValue(mockWishlists);

            await wishlistController.getAllWishlists(mockRequest, mockResponse);

            expect(mockResponse.json).toHaveBeenCalledWith(mockWishlists);
            expect(wishlistService.getAllWishlists).toHaveBeenCalled();
        });
    });
});