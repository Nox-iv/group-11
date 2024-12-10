import IMediaSearchClient from "../../interfaces/data/IMediaSearchClient";
import { MediaSearchResult } from "../documents/mediaSearchResult";
import { MediaSearchClientParams } from "../../interfaces/dto/MediaSearchClientParams";
import { Client } from "@elastic/elasticsearch";
import { estypes } from "@elastic/elasticsearch";

export default class MediaSearchClient extends IMediaSearchClient {
    constructor(client: Client) {
        super();
        this.client = client;
    }

    public async searchMedia(searchParams: MediaSearchClientParams): Promise<MediaSearchResult[]> {
        const results = await this.client.search<MediaSearchResult>({
            index: "m_index",
            from: searchParams.from,
            size: searchParams.size,
            query: {
                multi_match: {
                    query: searchParams.searchTerm,
                    fields: ["title", "description", "author", "genres"]
                }
            }
        })

        return results.hits.hits.map((hit: estypes.SearchHit) => hit._source as MediaSearchResult);
    }
}