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
                    type: ['Book']
                }
            });
            
            expect(filterResponse.status).toBe(200);
            expect(filterResponse.body.length).toEqual(1);
            expect(filterResponse.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_HOBBIT_BOOK]);
        });

        test('can filter by multiple media types, bringing back all media items with at least one filter match', async () => {
            const responseFilterOutGame = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                filters: {
                    type: ['Movie', 'Book']
                }
            }); 

            let expectedExclusions = new Set(mediaSearchResultTestData
                .filter(media => media.type === 'Game')
                .map(media => media.mediaId)
            );

            expect(responseFilterOutGame.status).toBe(200);

            let resultMediaIds = responseFilterOutGame.body.map((result: MediaSearchResult) => result.mediaId);
    
            for (let resultMediaId of resultMediaIds) {
                expect(expectedExclusions.has(resultMediaId)).toBe(false);
            }

            const responseFilterOutMovie = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                filters: {
                    type: ['Book', 'Game']
                }
            });

            expectedExclusions = new Set(mediaSearchResultTestData
                .filter(media => media.type === 'Movie')
                .map(media => media.mediaId)
            );

            expect(responseFilterOutMovie.status).toBe(200);

            resultMediaIds = responseFilterOutMovie.body.map((result: MediaSearchResult) => result.mediaId);
            for (let resultMediaId of resultMediaIds) {
                expect(expectedExclusions.has(resultMediaId)).toBe(false);
            }
        });

        test('can filter by release date range', async () => {
            // baseline - no filter
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({  
                searchTerm: 'The Lord of the Rings',
            });

            const expectedTop4Results = new Set([
                mediaSearchResultTestData[testDataIdx.LOTR_FELLOWSHIP].mediaId, 
                mediaSearchResultTestData[testDataIdx.LOTR_TWO_TOWERS].mediaId, 
                mediaSearchResultTestData[testDataIdx.LOTR_RETURN_KING].mediaId, 
                mediaSearchResultTestData[testDataIdx.LOTR_GAME].mediaId
            ]);

            expect(noFilterResponse.status).toBe(200);

            let noFilterResponseMediaIds = noFilterResponse.body.map((result: MediaSearchResult) => result.mediaId);

            // Check that the top 4 results match search term - verify filter works in conjunction with search term
            let top4Results = noFilterResponseMediaIds.slice(0, 4)
            for (let resultMediaId of top4Results) {
                expect(expectedTop4Results.has(resultMediaId)).toBe(true);
            }

            // Check that the results are within the provided release date range
            let lowerBound = new Date('2002-01-01T00:00:00.000Z');
            let upperBound = new Date('2003-01-01T23:59:59.999Z');

            const filterResponseUpperAndLowerBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                range: {
                    releaseDate: {
                        from: lowerBound,
                        to: upperBound
                    }
                }
            });

            // Make set of test data outside of the release date range
            let upperAndLowerBoundExpectedExclusions = new Set(mediaSearchResultTestData
                .filter(media => new Date(media.releaseDate) < lowerBound || new Date(media.releaseDate) > upperBound)
                .map(media => media.mediaId)
            );

            expect(filterResponseUpperAndLowerBound.status).toBe(200);
            expect(filterResponseUpperAndLowerBound.body[0].mediaId).toEqual(mediaSearchResultTestData[testDataIdx.LOTR_TWO_TOWERS].mediaId);

            let filterResponseUpperAndLowerBoundMediaIds = filterResponseUpperAndLowerBound.body.map((result: MediaSearchResult) => result.mediaId);
            for (let resultMediaId of filterResponseUpperAndLowerBoundMediaIds) {
                expect(upperAndLowerBoundExpectedExclusions.has(resultMediaId)).toBe(false);
            }

            // Check results are within upper bound, when only an upper bound is provided
            const filterResponseUpperBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                range: {
                    releaseDate: {
                        to: upperBound
                    }
                }
            });

            let upperBoundExpectedExclusions = new Set(mediaSearchResultTestData
                .filter(media => new Date(media.releaseDate) > upperBound)
                .map(media => media.mediaId)
            );

            expect(filterResponseUpperBound.status).toBe(200);
            
            let filterResponseUpperBoundMediaIds = filterResponseUpperBound.body.map((result: MediaSearchResult) => result.mediaId);
            for (let resultMediaId of filterResponseUpperBoundMediaIds) {
                expect(upperBoundExpectedExclusions.has(resultMediaId)).toBe(false);
            }

            let expectedTop2Results = new Set([
                mediaSearchResultTestData[testDataIdx.LOTR_FELLOWSHIP].mediaId, 
                mediaSearchResultTestData[testDataIdx.LOTR_TWO_TOWERS].mediaId
            ]);

            let top2Results = filterResponseUpperBoundMediaIds.slice(0, 2);
            for (let resultMediaId of top2Results) {
                expect(expectedTop2Results.has(resultMediaId)).toBe(true);
            }

            // Check results are within lower bound, when only a lower bound is provided
            lowerBound = new Date('2003-01-01T00:00:00.000Z');
            const filterResponseLowerBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Lord of the Rings',
                range: {
                    releaseDate: {
                        from: lowerBound
                    }
                }
            });

            let lowerBoundExpectedExclusions = new Set(mediaSearchResultTestData
                .filter(media => new Date(media.releaseDate) < lowerBound)
                .map(media => media.mediaId)
            );

            expect(filterResponseLowerBound.status).toBe(200);

            let filterResponseLowerBoundMediaIds = filterResponseLowerBound.body.map((result: MediaSearchResult) => result.mediaId);
            for (let resultMediaId of filterResponseLowerBoundMediaIds) {
                expect(lowerBoundExpectedExclusions.has(resultMediaId)).toBe(false);
            }

            expectedTop2Results = new Set([
                mediaSearchResultTestData[testDataIdx.LOTR_RETURN_KING].mediaId, 
                mediaSearchResultTestData[testDataIdx.LOTR_GAME].mediaId
            ]);

            let lowerBoundTop2Results = filterResponseLowerBoundMediaIds.slice(0, 2);
            for (let resultMediaId of lowerBoundTop2Results) {
                expect(expectedTop2Results.has(resultMediaId)).toBe(true);
            }
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
