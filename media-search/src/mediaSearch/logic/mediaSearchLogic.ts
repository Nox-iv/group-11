import IMediaSearchClient from "../interfaces/data/client/IMediaSearchClient";
import { MediaSearchLogicParams } from "../interfaces/dto/MediaSearchLogicParams";
import { MediaSearchResult } from "../data/documents/mediaSearchResult";
import IMediaSearchLogic from "../interfaces/logic/IMediaSearchLogic";
import { Message } from "../../shared/messaging/message";
import { MediaSearchFilters } from "../interfaces/data/MediaSearchFilters";
import { MediaSearchClientParams } from "../interfaces/dto/MediaSearchClientParams";
import { log } from "console";
import { IGenresFilterValues, IMediaSearchFilters, ITypeFilterValues } from "../interfaces/data/IMediaSearchFilters";

export default class MediaSearchLogic extends IMediaSearchLogic {
    constructor(mediaSearchClient: IMediaSearchClient) {
        super();
        this.mediaSearchClient = mediaSearchClient;
    }

    public async searchMedia(searchParams: MediaSearchLogicParams): Promise<Message<MediaSearchResult>> {
        const result = new Message<MediaSearchResult>(null);
        const filters = searchParams.filters;
        
        try {
            if (filters) {
                for (const currentFilter of Object.keys(filters)) {
                    const allowedValues = MediaSearchFilters.get(currentFilter);
                    const currentFilterValues = filters[currentFilter];
    
                    if (allowedValues == undefined) {
                        result.addError(new Error(`Filter has no allowed values: ${currentFilter}`));
                    } else if (!Array.isArray(currentFilterValues)) {
                        result.addError(new Error(`Filter value must be an array of filterable values: ${currentFilterValues}`));
                    } else {
                        for (const filterValue of currentFilterValues) {
                            if (!allowedValues.has(filterValue)) {
                                result.addError(new Error(`Invalid filter value: ${filterValue}`));
                            }
                        }
                    }
                }
            }
    
            const rangeParams : any = {};
            if (searchParams.range?.releaseDate) { 
                const currentDate = new Date();
                const range = searchParams.range.releaseDate;
    
                rangeParams.releaseDate = {}
    
                if (range.to && range.to > currentDate) {
                    result.addError(new Error(`Cannot use future date as release date upper bound`));
                }
    
                if (range.from && range.from > currentDate) {
                    result.addError(new Error(`Cannot use future date as release date lower bound`));
                }
    
                if (range.from && range.to && range.to < range.from) {
                    result.addError(new Error(`Release date upper bound must be greater than lower bound`));
                }
    
                if (range.to) {
                    rangeParams.releaseDate.to = range.to.toISOString().split('T')[0];
                }
    
                if (range.from) {
                    rangeParams.releaseDate.from = range.from.toISOString().split('T')[0];
                }
            }
    
            const clientParams : MediaSearchClientParams = {
                from: searchParams.page * searchParams.pageSize,
                size: searchParams.pageSize,
                searchTerm: searchParams.searchTerm,
                filters: searchParams.filters,
                range: rangeParams,
            }
    
            if (searchParams.availableAtLocation) {
                clientParams.availableAtLocation = searchParams.availableAtLocation;
            }
    
            if (!result.hasErrors()) {
                const results = await this.mediaSearchClient.searchMedia(clientParams);
                result.value = results;
            }
    
        } catch (error) {
            result.addError(error as Error);
        } finally {
            return result;
        }
    }

    public async getSearchFilters(): Promise<IMediaSearchFilters> {
        const result : IMediaSearchFilters = {
            type: [],
            genres: [],
        };

        for (const currentFilter of Object.keys(result)) {
            if (currentFilter == 'type') {
                result.type = Array.from(MediaSearchFilters.get(currentFilter)!) as ITypeFilterValues | [];
            } else if (currentFilter == 'genres') {
                result.genres = Array.from(MediaSearchFilters.get(currentFilter)!) as IGenresFilterValues | [];
            }
        }

        return result;
    }

    public async getMediaById(mediaId: number): Promise<MediaSearchResult> {
        return await this.mediaSearchClient.getMediaById(mediaId);
    }
}