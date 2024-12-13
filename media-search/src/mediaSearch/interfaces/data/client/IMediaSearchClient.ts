import { NotImplementedError } from "../../../../shared/errors/notImplementedError";
import { MediaSearchResult } from "../../../data/documents/mediaSearchResult";
import { MediaSearchClientParams } from "../../dto/MediaSearchClientParams";

export default class IMediaSearchClient {
    //@ts-ignore
    protected client: Client;
    
    constructor() {}

    public searchMedia(searchParams: MediaSearchClientParams): Promise<MediaSearchResult[]> {
        throw new NotImplementedError();
    }
}