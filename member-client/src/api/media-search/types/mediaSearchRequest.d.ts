import { MediaSearchFilters } from "./mediaSearchFilters";

export interface MediaSearchRequest {
    searchTerm: string;
    page: number;
    pageSize: number;
    filters?: MediaSearchFilters;
    range?: {
        releaseDate?: {
            from?: Date;
            to?: Date;
        }
    }
    availableAtLocation?: number;
}