import app from '../app';
import { elasticSearchClient } from '../elasticsearch/client/elasticSearchClient';
import { mediaSearchResultTestData, testDataIdx } from './data';

import request from 'supertest';

import { Server } from 'http';
import { log } from 'console';
import fs from 'fs';

describe('Media Search API Tests', () => {
    let server: Server;
    let agent: request.Agent;

    beforeAll(async () => {
        log('1) Reading index template file...')
        const mediaIndexTemplateString = fs.readFileSync(`${__dirname}/../elasticsearch/templates/media-template.json`, 'utf8');
        const mediaIndexTemplate = JSON.parse(mediaIndexTemplateString);

        log('Done!')

        log('2) Creating index template...')
        await elasticSearchClient.indices.putTemplate({
            name: 'media-template',
            body: mediaIndexTemplate
        });

        log('Done!')

        log('3) Creating index...')
        await elasticSearchClient.indices.create({ index: 'm_index' });

        log('Done!')

        log('4) Adding test data to index...')
        const operations = mediaSearchResultTestData.flatMap(media => [
            { index: { _index: 'm_index', _id: media.mediaId } },
            media
        ]);

        await elasticSearchClient.bulk({
            index: 'm_index',
            refresh: true,
            operations
        })

        log('Done!')

        log('5) Starting server...')
        server = app.listen(8080);
        agent = request.agent(server);

        log('Done!')

        log('6) Tests starting...')
    }, 20000);

    describe('Search Term...', () => {
        test('can match a single media item.', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: mediaSearchResultTestData[testDataIdx.RED_DEAD_REDEMPTION_2].title
            });

            expect(response.status).toBe(200);
            // Only one result because the search term is an exact match
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.RED_DEAD_REDEMPTION_2]);
        });

        test('can match multiple media items.', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The legend of Zelda'
            });


            console.log(response.body);
            expect(response.status).toBe(200);
            // All test data contains the word 'the', so everything is brought back
            expect(response.body.length).toEqual(4);
            // Best match first
            expect(response.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_LEGEND_OF_ZELDA]);
        });
    });

    afterAll(async () => {
        log('Done!')

        log('7) Deleting index...')
        await elasticSearchClient.indices.delete({ index: 'm_index' });
        log('Done!')

        log('8) Closing elasticsearch client...')
        await elasticSearchClient.close();
        log('Done!')

        log('9) Closing server...')
        server.close()
        log('Done!')
    });
});
