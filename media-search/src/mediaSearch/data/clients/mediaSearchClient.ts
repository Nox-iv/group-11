import IMediaSearchClient from "../../interfaces/data/client/IMediaSearchClient";
import { MediaDocument, MediaSearchResult } from "../documents/mediaSearchResult";
import { MediaSearchClientParams } from "../../interfaces/dto/MediaSearchClientParams";
import { Client, estypesWithBody } from "@elastic/elasticsearch";
import { estypes } from "@elastic/elasticsearch";
import { log } from "console";
export default class MediaSearchClient extends IMediaSearchClient {
    constructor(client: Client) {
        super();
        this.client = client;
    }

    public async searchMedia(searchParams: MediaSearchClientParams): Promise<MediaSearchResult> {
        try {
            const queryContainer: estypesWithBody.QueryDslQueryContainer = {};
            const parentQuery: estypesWithBody.QueryDslBoolQuery = {};

            parentQuery.must = [];
            parentQuery.filter = [];

            if (searchParams.searchTerm) {
                parentQuery.must.push(
                    {
                        multi_match: {
                            query: searchParams.searchTerm,
                            fields: ["title", "description", "author", "genres"]
                        }
                    }
                );
            }

            if (searchParams.range) {
                const rangeQueries = Object.entries(searchParams.range).map(([key, value]) => ({
                    range: {
                        [key]: {
                            ...(value.from && { gte: value.from }),
                            ...(value.to && { lte: value.to })
                        }
                    }
                }));

                parentQuery.must.push(...rangeQueries);
            }

            if (searchParams.filters) {
                parentQuery.filter.push(...Object.entries(searchParams.filters).map(
                    ([key, value]) => (
                        {
                             terms: { [key]: value } 
                        }
                    )
                ));
            }

            if (searchParams.availableAtLocation) {
                const availableAtLocationQuery = {
                    nested: {
                        path: "mediaStock",
                        query: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            "mediaStock.locationId": searchParams.availableAtLocation
                                        }
                                    },
                                    {
                                        range: {
                                            "mediaStock.stockCount": {
                                                gte: 1
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }

                parentQuery.filter.push(availableAtLocationQuery);
            }

            queryContainer.bool = parentQuery;
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

            let totalHits: number;

            if (typeof response.hits.total === 'object') {
                totalHits = response.hits.total.value
              } else {
                totalHits = response.hits.total ?? 0
              }

            return {
                totalHits: totalHits,
                mediaDocuments: response.hits.hits.map((hit: estypes.SearchHit) => hit._source as MediaDocument)
            };
        } catch (error) {
            log(error)
            throw new Error('Internal search error');
        }
    }
}
