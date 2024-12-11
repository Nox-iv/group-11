import app from '../app';
import { elasticSearchClient } from '../elasticsearch/client/elasticSearchClient';
import { mediaSearchResultTestData, testDataIdx } from './data';

import request from 'supertest';

import { Server } from 'http';
import { log } from 'console';
import fs from 'fs';
import { MediaSearchResult } from '../mediaSearch/data/documents/mediaSearchResult';

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
            expect(response.body.length).toBeGreaterThan(1);
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
            
            expect(filterResponse.status).toBe(200);
            expect(filterResponse.body.length).toEqual(1);
            expect(filterResponse.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_HOBBIT_BOOK]);
        });

        test('can filter by release date range', async () => {
            let responseMediaIds: number[] = [];
            let expectedExclusions: number[] = [];

            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({  
                searchTerm: 'The Lord of the Rings',
            });

            const expectedTop3Results = [testDataIdx.LOTR_FELLOWSHIP, testDataIdx.LOTR_TWO_TOWERS, testDataIdx.LOTR_RETURN_KING];
            responseMediaIds = noFilterResponse.body.map((result: MediaSearchResult) => result.mediaId);

            let top3Results = responseMediaIds.slice(0, 3)
            for (let expectedTopResult of expectedTop3Results) {
                expect(top3Results.includes(mediaSearchResultTestData[expectedTopResult].mediaId)).toBe(true);
            }

            const filterResponseUpperAndLowerBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                range: {
                    releaseDate: {
                        from: '2002-01-01',
                        to: '2003-01-01'
                    }
                }
            });

            expect(filterResponseUpperAndLowerBound.status).toBe(200);
            expect(filterResponseUpperAndLowerBound.body[0].mediaId).toEqual(mediaSearchResultTestData[testDataIdx.LOTR_TWO_TOWERS].mediaId);

            expectedExclusions = [testDataIdx.LOTR_RETURN_KING, testDataIdx.LOTR_FELLOWSHIP];
            responseMediaIds = filterResponseUpperAndLowerBound.body.map((result: MediaSearchResult) => result.mediaId);
            for (let expectedExclusion of expectedExclusions) {
                expect(responseMediaIds.includes(mediaSearchResultTestData[expectedExclusion].mediaId)).toBe(false);
            }

            const filterResponseUpperBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                range: {
                    releaseDate: {
                        to: '2003-01-01'
                    }
                }
            });

            expectedExclusions = [testDataIdx.LOTR_RETURN_KING];
            expect(filterResponseUpperBound.status).toBe(200);
            
            responseMediaIds = filterResponseUpperBound.body.map((result: MediaSearchResult) => result.mediaId);
            for (let expectedExclusion of expectedExclusions) {
                expect(responseMediaIds.includes(mediaSearchResultTestData[expectedExclusion].mediaId)).toBe(false);
            }

            const expectedTop2Results = [testDataIdx.LOTR_FELLOWSHIP, testDataIdx.LOTR_TWO_TOWERS];
            const top2Results = responseMediaIds.slice(0, 2);
            for (let expectedTopResult of expectedTop2Results) {
                expect(top2Results.includes(mediaSearchResultTestData[expectedTopResult].mediaId)).toBe(true);
            }

            const filterResponseLowerBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                range: {
                    releaseDate: {
                        from: '2003-01-01'
                    }
                }
            });

            expectedExclusions = [testDataIdx.LOTR_FELLOWSHIP, testDataIdx.LOTR_TWO_TOWERS];
            expect(filterResponseLowerBound.status).toBe(200);


            responseMediaIds = filterResponseLowerBound.body.map((result: MediaSearchResult) => result.mediaId);
            for (let expectedExclusion of expectedExclusions) {
                expect(responseMediaIds.includes(mediaSearchResultTestData[expectedExclusion].mediaId)).toBe(false);
            }

            expect(filterResponseLowerBound.body[0].mediaId).toEqual(mediaSearchResultTestData[testDataIdx.LOTR_RETURN_KING].mediaId);
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
