import { Message } from "../../shared/messaging/message";
import { MediaSearchResult } from "../data/documents/mediaSearchResult";
import { MediaSearchLogicParams } from "../interfaces/dto/MediaSearchLogicParams";
import IMediaSearchLogic from "../interfaces/logic/IMediaSearchLogic";
import { Request, Response } from "express";

export default class MediaSearchApi {
    constructor(private readonly mediaSearchLogic: IMediaSearchLogic) {}

    public async searchMedia(request : Request, response : Response): Promise<void> {
        const searchParams: Message<MediaSearchLogicParams> = this.parseSearchParams(request);

        if (searchParams.hasErrors()) {
            response.status(400).json(searchParams.errors);
            return;
        }

        const result = await this.mediaSearchLogic.searchMedia(searchParams.value!);

        if (result.hasErrors()) {
            response.status(500).json(result.errors);
        } else {
            response.status(200).json(result.value);
        }
    }

    private parseSearchParams(request: Request): Message<MediaSearchLogicParams> {
        const result = new Message<MediaSearchLogicParams>(null);

        const searchTerm = request.body?.searchTerm ?? '';
        const page = Number(request.body?.page ?? 0);
        const pageSize = Number(request.body?.pageSize ?? 10);

        if (isNaN(page)) {
            result.addError(new Error('Page must be a number'));
        }

        if (isNaN(pageSize)) {
            result.addError(new Error('Page size must be a number'));
        }

        if (!result.hasErrors()) {
            result.value = { searchTerm, page, pageSize };
        }

        return result;
    }
}