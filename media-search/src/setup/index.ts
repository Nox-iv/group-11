import { elasticSearchClient } from '../elasticsearch/client/elasticSearchClient';
import MediaSearchClient from '../mediaSearch/data/clients/mediaSearchClient';
import MediaSearchLogic from '../mediaSearch/logic/mediaSearchLogic';
import MediaSearchApi from '../mediaSearch/api/mediaSearchApi';

export default function setup() {
    const mediaSearchClient = new MediaSearchClient(elasticSearchClient);
    const mediaSearchLogic = new MediaSearchLogic(mediaSearchClient);
    const mediaSearchApi = new MediaSearchApi(mediaSearchLogic);

    return { mediaSearchApi };
}