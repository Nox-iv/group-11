import { MediaSearchRequest } from "./types/mediaSearchRequest";
import { MediaDocument, MediaSearchResult, MediaStock } from "./types/mediaSearchResult";
import { mockContent } from "../../test/data/content";
import dayjs from "dayjs";

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
        const response = await fetch(`${import.meta.env.VITE_MEDIA_SEARCH_API_URL}/search`, {
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
            .sort((a: MediaDocument, b: MediaDocument) => a.title.localeCompare(b.title))
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

                if (mediaSearchRequest.range?.releaseDate?.from) {
                    hasMatch = (hasMatch && dayjs(media.releaseDate).isAfter(dayjs(mediaSearchRequest.range.releaseDate.from)))
                }

                if (mediaSearchRequest.range?.releaseDate?.to) {
                    hasMatch = (hasMatch && dayjs(media.releaseDate).isBefore(dayjs(mediaSearchRequest.range.releaseDate.to)))
                }

                return hasMatch
            })
        return {
            totalHits: data.length,
            data: data.slice(mediaSearchRequest.page * mediaSearchRequest.pageSize, (mediaSearchRequest.page + 1) * mediaSearchRequest.pageSize)
        }
    } else {
        const response = await fetch(`${import.meta.env.VITE_MEDIA_SEARCH_API_URL}/search`, {
            method: 'POST',
            body: JSON.stringify(mediaSearchRequest),
        });

        return response.json();
    }
}

export const getMediaById = async (mediaId: number) : Promise<MediaDocument> => {
    if (process.env.NODE_ENV === 'development') {
        return mockContent.find((media: MediaDocument) => media.mediaId === mediaId) as MediaDocument;
    } else {
        const response = await fetch(`${import.meta.env.VITE_MEDIA_SEARCH_API_URL}/search/${mediaId}`);

        return response.json();
    }
}