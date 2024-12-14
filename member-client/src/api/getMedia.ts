import { MediaSearchRequest } from "./types/mediaSearchRequest";
import { MediaDocument, MediaSearchResult, MediaStock } from "./types/mediaSearchResult";
import { mockContent } from "../test/data/content";

export const getAllMediaWithType = async (mediaType: string, offset: number, limit: number) : Promise<MediaSearchResult> => {
    if (process.env.NODE_ENV === 'development') {
        const data =  mockContent
            .filter((media: MediaDocument) => media.type === mediaType)
            .slice(offset, offset + limit);

        return {
            totalHits: data.length,
            data
        }
    } else {
        const response = await fetch('/api/media/search', {
            method: 'POST',
            body: JSON.stringify({
                searchTerm: '',
                page: offset,
                pageSize: limit,
                filters: {
                    type: [mediaType],
                    genres: [],
                },
            } as MediaSearchRequest),
        });
    
        return response.json();
    }
}

export const searchMedia = async (mediaSearchRequest: MediaSearchRequest) : Promise<MediaSearchResult> => {
    if (process.env.NODE_ENV === 'development') {
        const data = mockContent
            .filter((media: MediaDocument) => {
                let hasMatch = true
                if (mediaSearchRequest.filters) {
                    if (mediaSearchRequest.filters?.type?.length > 0) {
                        hasMatch = (hasMatch && mediaSearchRequest.filters.type.includes(media.type))
                    }

                    if (mediaSearchRequest.filters?.genres?.length > 0) {
                        hasMatch = hasMatch && mediaSearchRequest.filters.genres.some((genre: string) => media.genres.includes(genre))
                    }
                }

                if (mediaSearchRequest.searchTerm) {
                    hasMatch = (hasMatch && (mediaSearchRequest.searchTerm == '' || media.title.toLowerCase().includes(mediaSearchRequest.searchTerm.toLowerCase())))
                }

                if (mediaSearchRequest.availableAtLocation) {
                    hasMatch = (hasMatch && media.mediaStock.some((stock: MediaStock) => stock.locationId === mediaSearchRequest.availableAtLocation))
                }

                return hasMatch
            })
            .slice(mediaSearchRequest.page, mediaSearchRequest.page + mediaSearchRequest.pageSize);
        
        return {
            totalHits: data.length,
            data: data
        }
    } else {
        const response = await fetch('/api/media/search', {
            method: 'POST',
            body: JSON.stringify(mediaSearchRequest),
        });

        return response.json();
    }
}

export const getMediaById = async (mediaId: number) : Promise<MediaDocument> => {
    console.log(mediaId);
    if (process.env.NODE_ENV === 'development') {
        return mockContent.find((media: MediaDocument) => media.mediaId === mediaId) as MediaDocument;
    } else {
        const response = await fetch(`/api/media/${mediaId}`);

        return response.json();
    }
}