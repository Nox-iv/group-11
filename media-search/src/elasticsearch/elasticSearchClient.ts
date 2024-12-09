import { Client } from "@elastic/elasticsearch";

export const elasticSearchClient = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
        apiKey: {
            id: process.env.ELASTICSEARCH_API_KEY_ID!,
            api_key: process.env.ELASTICSEARCH_API_KEY_SECRET!
        }
    }
})