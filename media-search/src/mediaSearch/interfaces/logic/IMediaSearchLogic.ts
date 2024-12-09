import { NotImplementedError } from "../../../shared/errors/notImplementedError";
import { MediaSearchParams } from "../dto/MediaSearchParams";
import { MediaSearchResult } from "../../data/models/mediaSearchResult";

export default class IMediaSearchLogic {
    constructor() {

    }

    public searchMedia(searchParams: MediaSearchParams): Promise<MediaSearchResult[]> {
        throw new NotImplementedError();
    }
}