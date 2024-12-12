export interface MediaSearchLogicParams {
    searchTerm: string;
    page: number;
    pageSize: number;
    filters?: any;
    range?: {
        releaseDate?: {
            from?: Date;
            to?: Date;
        }
    }
    availableAtLocation?: number;
}