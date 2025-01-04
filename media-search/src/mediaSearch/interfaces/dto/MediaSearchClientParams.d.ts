import { IMediaSearchFilters } from "../data/IMediaSearchFilters";

export interface MediaSearchClientParams {
    searchTerm: string;
    from : number;
    size : number;
    filters?: IMediaSearchFilters;
    range?: {
        releaseDate?: {
            from?: string;
            to?: string;
        }
    }
    availableAtLocation?: number;
}