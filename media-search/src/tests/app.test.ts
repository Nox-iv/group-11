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

    describe('200 POST /search', () => {
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

            expect(response.status).toBe(200);
            // All test data contains the word 'the', so everything is brought back
            expect(response.body.length).toEqual(5);
            // Best match first
            expect(response.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_LEGEND_OF_ZELDA]);
        });

        test('can filter by media type', async () => {
            // Establish baseline by verifying search term returns both book and movie
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Hobbit',
            });

            expect(noFilterResponse.status).toBe(200);
            expect(noFilterResponse.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_HOBBIT_BOOK]);
            expect(noFilterResponse.body[1]).toEqual(mediaSearchResultTestData[testDataIdx.THE_HOBBIT_MOVIE]);

            // Now filter for the book
            const filterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Hobbit',
                filters: {
                    type: 'Book'
                }
            });
            
            log(filterResponse.body)

            expect(filterResponse.status).toBe(200);
            expect(filterResponse.body.length).toEqual(1);
            expect(filterResponse.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_HOBBIT_BOOK]);
        });
    });

    describe('400 POST /search', () => {
        test('return an error if the page is not a number', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Hobbit',
                page: 'not a number'
            });

            expect(response.status).toBe(400);
        });

        test('return an error if the page size is not a number', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Hobbit',
                pageSize: 'not a number'
            });

            expect(response.status).toBe(400);
        });

        test('return an error if the media filter value is not valid', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Hobbit',
                filters: {
                    type: 'not a valid type'
                }
            });

            expect(response.status).toBe(400);
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