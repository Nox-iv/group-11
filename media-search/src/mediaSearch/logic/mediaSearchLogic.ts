import IMediaSearchClient from "../interfaces/data/client/IMediaSearchClient";
import { MediaSearchLogicParams } from "../interfaces/dto/MediaSearchLogicParams";
import { MediaSearchResult } from "../data/documents/mediaSearchResult";
import IMediaSearchLogic from "../interfaces/logic/IMediaSearchLogic";
import { Message } from "../../shared/messaging/message";
import { MediaSearchFilters } from "../interfaces/data/MediaSearchFilters";
import { assert, log } from "console";

export default class MediaSearchLogic extends IMediaSearchLogic {
    constructor(mediaSearchClient: IMediaSearchClient) {
        super();
        this.mediaSearchClient = mediaSearchClient;
    }

    public async searchMedia(searchParams: MediaSearchLogicParams): Promise<Message<MediaSearchResult[]>> {
        const result = new Message<MediaSearchResult[]>([]);
        const reqFilters = searchParams.filters;

        if (reqFilters) {
            for (const currentReqFilter of Object.keys(reqFilters)) {
                const allowedValues = MediaSearchFilters.get(currentReqFilter);
                const currentReqFilterValue = reqFilters[currentReqFilter];
                if (allowedValues == undefined || !allowedValues.includes(currentReqFilterValue)) {
                    result.addError(new Error(`Invalid filter value: ${currentReqFilterValue}`));
                }
            }
        }

        if (!result.hasErrors()) {
            const results = await this.mediaSearchClient.searchMedia({
                from: searchParams.page * searchParams.pageSize,
                size: searchParams.pageSize,
                searchTerm: searchParams.searchTerm,
                filters: searchParams.filters
            });
            
            result.value = results;
        }

        return result;
    }
}