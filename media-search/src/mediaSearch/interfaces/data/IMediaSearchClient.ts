import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaSearchResult } from "../../data/models/mediaSearchResult";
import { MediaSearchParams } from "../dto/MediaSearchParams";

export class IMediaSearchClient {
    constructor() {

    }

    public searchMedia(searchParams: MediaSearchParams): Promise<MediaSearchResult[]> {
        throw new NotImplementedError();
    }
}