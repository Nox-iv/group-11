import IMediaSearchClient from "../../interfaces/data/client/IMediaSearchClient";
import { MediaSearchResult } from "../documents/mediaSearchResult";
import { MediaSearchClientParams } from "../../interfaces/dto/MediaSearchClientParams";
import { Client, estypesWithBody } from "@elastic/elasticsearch";
import { estypes } from "@elastic/elasticsearch";

export default class MediaSearchClient extends IMediaSearchClient {
    constructor(client: Client) {
        super();
        this.client = client;
    }

    public async searchMedia(searchParams: MediaSearchClientParams): Promise<MediaSearchResult[]> {
        const boolQuery : estypesWithBody.QueryDslBoolQuery = {
            must: [
                {
                    multi_match: {
                        query: searchParams.searchTerm,
                        fields: ["title", "description", "author", "genres"]
                    }
                }
            ]
        }

        if (searchParams.filters) {
            boolQuery.filter = Object.entries(searchParams.filters).map(
                ([key, value]) => ({term: {[key]: value}})
            );
        }

        const response : estypes.SearchResponse<MediaSearchResult> = await this.client.search<MediaSearchResult>({
            index: "m_index",
            from: searchParams.from,
            size: searchParams.size,
            query: {
                bool: boolQuery
            }
        })

        if(response._shards.failed > 0) {
            console.error(response._shards);
            console.error(response)
            throw new Error('Internal search error');
        }

        return response.hits.hits.map((hit: estypes.SearchHit) => hit._source as MediaSearchResult);
    }
}