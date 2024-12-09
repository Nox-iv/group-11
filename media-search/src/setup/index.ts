import { elasticSearchClient } from '../elasticsearch/elasticSearchClient';
import MediaSearchClient from '../mediaSearch/data/elasticsearch/mediaSearchClient';
import MediaSearchLogic from '../mediaSearch/logic/mediaSearchLogic';
import MediaSearchApi from '../mediaSearch/api/mediaSearchApi';

export default function setup() {
    const mediaSearchClient = new MediaSearchClient(elasticSearchClient);
    const mediaSearchLogic = new MediaSearchLogic(mediaSearchClient);
    const mediaSearchApi = new MediaSearchApi(mediaSearchLogic);

    return { mediaSearchApi };
}