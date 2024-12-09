import IMediaSearchClient from "../interfaces/data/IMediaSearchClient";
import { MediaSearchLogicParams } from "../interfaces/dto/MediaSearchLogicParams";
import { MediaSearchResult } from "../data/models/mediaSearchResult";
import IMediaSearchLogic from "../interfaces/logic/IMediaSearchLogic";
import { Message } from "../../shared/messaging/message";

export default class MediaSearchLogic extends IMediaSearchLogic {
    constructor(mediaSearchClient: IMediaSearchClient) {
        super();
        this.mediaSearchClient = mediaSearchClient;
    }

    public async searchMedia(searchParams: MediaSearchLogicParams): Promise<Message<MediaSearchResult[]>> {
        const result = new Message<MediaSearchResult[]>([]);
        try {
            const results = await this.mediaSearchClient.searchMedia({
                from: searchParams.page * searchParams.pageSize,
                size: searchParams.pageSize,
                searchTerm: searchParams.searchTerm
            });

            result.value = results;
        } catch (error) {
            result.addError(error as Error);
        } finally {
            return result;
        }
    }
}