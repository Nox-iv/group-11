import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaSearchLogicParams } from "../dto/MediaSearchLogicParams";
import { MediaSearchResult } from "../../data/documents/mediaSearchResult";
import IMediaSearchClient from "../data/client/IMediaSearchClient";
import { Message } from "../../../shared/messaging/message";
import { IMediaSearchFilters } from "../data/IMediaSearchFilters";
export default class IMediaSearchLogic {
    //@ts-ignore
    protected mediaSearchClient: IMediaSearchClient;

    constructor() {

    }

    public searchMedia(searchParams: MediaSearchLogicParams): Promise<Message<MediaSearchResult[]>> {
        throw new NotImplementedError();
    }

    public getSearchFilters(): Promise<IMediaSearchFilters> {
        throw new NotImplementedError();
    }
}