import { MediaSearchRequest } from "./types/mediaSearchRequest";
import { MediaSearchResult } from "./types/mediaSearchResult";
import { mockContent } from "../test/data/content";

export const getAllContentWithType = async (mediaType: string, offset: number, limit: number) : Promise<MediaSearchResult[]> => {
    if (process.env.NODE_ENV === 'development') {
        return mockContent
            .filter((media: MediaSearchResult) => media.type === mediaType)
            .slice(offset, offset + limit);
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