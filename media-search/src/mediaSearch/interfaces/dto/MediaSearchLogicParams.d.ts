import { IMediaSearchFilters } from "../data/IMediaSearchFilters";

export interface MediaSearchLogicParams {
    searchTerm: string;
    page: number;
    pageSize: number;
    filters?: any;
}