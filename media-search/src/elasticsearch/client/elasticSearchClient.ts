import { Client, ClientOptions } from "@elastic/elasticsearch";

const config: ClientOptions = {}

if (process.env.NODE_ENV === 'development') {
    config.node = process.env.ELASTICSEARCH_URL;
} else {
    config.node = process.env.ELASTICSEARCH_URL;
    config.auth = {
        apiKey: {
            id: process.env.ELASTICSEARCH_API_KEY_ID!,
            api_key: process.env.ELASTICSEARCH_API_KEY_SECRET!
        }
    }
}

export const elasticSearchClient = new Client(config);