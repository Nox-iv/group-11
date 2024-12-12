import { log } from "console";
import { Message } from "../../shared/messaging/message";
import { MediaSearchLogicParams } from "../interfaces/dto/MediaSearchLogicParams";
import IMediaSearchLogic from "../interfaces/logic/IMediaSearchLogic";
import { Request, Response } from "express";

export default class MediaSearchApi {
    constructor(private readonly mediaSearchLogic: IMediaSearchLogic) {}

    public async searchMedia(request : Request, response : Response): Promise<void> {
        try {
            const searchParams: Message<MediaSearchLogicParams> = this.parseSearchParams(request);

            if (searchParams.hasErrors()) {
                response.status(400).json(searchParams.errors);
                return;
            }

            const result = await this.mediaSearchLogic.searchMedia(searchParams.value!);

            if (result.hasErrors()) {
                response.status(400).json(result.errors);
            } else {
                response.status(200).json(result.value);
            }
        } catch (error) {
            response.status(500).json((error as Error).message);
        }
    }

    private parseSearchParams(request: Request): Message<MediaSearchLogicParams> {
        const result = new Message<MediaSearchLogicParams>(null);

        const searchTerm = request.body?.searchTerm ?? '';
        const page = Number(request.body?.page ?? 0);
        const pageSize = Number(request.body?.pageSize ?? 10);
        const filters = request.body?.filters ?? {};
        const range = request.body?.range ?? {};
        let availableAtLocation = undefined;

        if (request.body?.availableAtLocation) {
            let tmp = parseInt(request.body?.availableAtLocation);
            if (isNaN(tmp)) {
                result.addError(new Error('Available at location must be a number or an empty field.'));
            } else {
                availableAtLocation = tmp;
            }
        }

        if (range?.releaseDate?.from) {
            let fromDate = Date.parse(range.releaseDate.from);
            if (isNaN(fromDate)) {
                result.addError(new Error('Release date range start must be a valid date'));
            } else {
                range.releaseDate.from = new Date(fromDate);
            }
        }

        if (range?.releaseDate?.to) {
            let toDate = Date.parse(range.releaseDate.to);
            if (isNaN(toDate)) {
                result.addError(new Error('Release date range end must be a valid date'));
            } else {
                range.releaseDate.to = new Date(toDate);
            }
        }

        if (isNaN(page)) {
            result.addError(new Error('Page must be a number'));
        }

        if (isNaN(pageSize)) {
            result.addError(new Error('Page size must be a number'));
        }

        if (!result.hasErrors()) {
            result.value = { searchTerm, page, pageSize, filters, range, availableAtLocation };
        }

        return result;
    }
}