import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaSearchLogicParams } from "../dto/MediaSearchLogicParams";
import { MediaSearchResult } from "../../data/models/mediaSearchResult";
import IMediaSearchClient from "../data/IMediaSearchClient";
import { Message } from "../../../shared/messaging/message";
export default class IMediaSearchLogic {
    //@ts-ignore
    protected mediaSearchClient: IMediaSearchClient;

    constructor() {

    }

    public searchMedia(searchParams: MediaSearchLogicParams): Promise<Message<MediaSearchResult[]>> {
        throw new NotImplementedError();
    }
}