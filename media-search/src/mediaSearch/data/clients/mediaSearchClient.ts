import IMediaSearchClient from "../../interfaces/data/client/IMediaSearchClient";
import { MediaSearchResult } from "../documents/mediaSearchResult";
import { MediaSearchClientParams } from "../../interfaces/dto/MediaSearchClientParams";
import { Client, estypesWithBody } from "@elastic/elasticsearch";
import { estypes } from "@elastic/elasticsearch";
import { log } from "console";
export default class MediaSearchClient extends IMediaSearchClient {
    constructor(client: Client) {
        super();
        this.client = client;
    }

    public async searchMedia(searchParams: MediaSearchClientParams): Promise<MediaSearchResult[]> {
        try {
            const queryContainer: estypesWithBody.QueryDslQueryContainer = {};
            const boolQuery: estypesWithBody.QueryDslBoolQuery = {
                must: [
                    {
                        multi_match: {
                            query: searchParams.searchTerm,
                            fields: ["title", "description", "author", "genres"]
                        }
                    }
                ]
            };

            if (searchParams.range) {
                const rangeQueries = Object.entries(searchParams.range).map(([key, value]) => ({
                    range: {
                        [key]: {
                            ...(value.from && { gte: value.from }),
                            ...(value.to && { lte: value.to })
                        }
                    }
                }));

                if (Array.isArray(boolQuery.must)) {
                    boolQuery.must.push(...rangeQueries);
                } else {
                    boolQuery.must = rangeQueries;
                }
            }

            if (searchParams.filters) {
                boolQuery.filter = Object.entries(searchParams.filters).map(
                    ([key, value]) => (
                        {
                             terms: { [key]: value } 
                        }
                    )
                );
            }

            queryContainer.bool = boolQuery;

            const response : estypes.SearchResponse<MediaSearchResult> = await this.client.search<MediaSearchResult>({
                index: "m_index",
                from: searchParams.from,
                size: searchParams.size,
                query: queryContainer
            })

            if(response._shards.failed > 0) {
                log(response._shards)
                log(response)
                throw new Error('Internal search error');
            }

            return response.hits.hits.map((hit: estypes.SearchHit) => hit._source as MediaSearchResult);
        } catch (error) {
            log(error)
            throw new Error('Internal search error');
        }
    }
}
