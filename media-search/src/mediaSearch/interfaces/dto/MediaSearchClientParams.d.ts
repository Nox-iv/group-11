import { IMediaSearchFilters } from "../data/IMediaSearchFilters";

export interface MediaSearchClientParams {
    searchTerm: string;
    from : number;
    size : number;
    filters?: IMediaSearchFilters;
}