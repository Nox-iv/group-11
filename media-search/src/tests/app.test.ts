import app from '../app';
import { elasticSearchClient } from '../elasticsearch/client/elasticSearchClient';
import { Server } from 'http';
import request from 'supertest';
import { mediaSearchResultTestData } from './data';

let server: Server;
let agent: request.SuperAgentTest;

beforeAll(async () => {
    const server = app.listen(8080);
    const agent = request.agent(server);

    await elasticSearchClient.indices.delete({ index: 'media-search-test' });
    await elasticSearchClient.indices.create({ index: 'media-search-test' });

    
})

afterAll(() => {
    server.close();
})