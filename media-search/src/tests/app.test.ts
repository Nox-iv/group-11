import app from '../app';
import { elasticSearchClient } from '../elasticsearch/client/elasticSearchClient';
import { mediaSearchResultTestData, testDataIdx } from './data';

import request from 'supertest';

import { Server } from 'http';
import { log } from 'console';
import fs from 'fs';
import { MediaSearchResult, MediaStock } from '../mediaSearch/data/documents/mediaSearchResult';
import { MediaSearchFilters } from '../mediaSearch/interfaces/data/MediaSearchFilters';

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
            // 'The' is a common word, so all test data is returned
            expect(response.body.length).toBeGreaterThan(1);
            // Best match first
            expect(response.body[0]).toEqual(mediaSearchResultTestData[testDataIdx.THE_LEGEND_OF_ZELDA]);
        });

        test('can filter by media type', async () => {
            // Verify that test data has examples of books and at least one other type, in this case movies.
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
            });

            expect(noFilterResponse.status).toBe(200);
            // Verify that test data has examples of books.
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.type === 'Book')).toBe(true);
            // Verify that test data has examples of movies.
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.type === 'Movie')).toBe(true);

            const filterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                filters: {
                    type: ['Book']
                }
            });
            
            expect(filterResponse.status).toBe(200);
            expect(filterResponse.body.length).toBeGreaterThan(1);
            expect(filterResponse.body.some((x: MediaSearchResult) => x.type !== 'Book')).toBe(false);
        });

        test('can filter by multiple media types, bringing back all media items with at least one filter match', async () => {
            // Verify that test data has examples of books, games and movies (types used in tests below).
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
            });

            expect(noFilterResponse.status).toBe(200);
            expect(noFilterResponse.body.length).toBeGreaterThan(1);
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.type === 'Book')).toBe(true);
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.type === 'Game')).toBe(true);
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.type === 'Movie')).toBe(true);

            const responseOnlyBooksAndMovies = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                filters: {
                    type: ['Movie', 'Book']
                }
            }); 

            expect(responseOnlyBooksAndMovies.status).toBe(200);
            expect(responseOnlyBooksAndMovies.body.length).toBeGreaterThan(1);
            expect(responseOnlyBooksAndMovies.body.some((x: MediaSearchResult) => x.type !== 'Book' && x.type !== 'Movie')).toBe(false);
        });

        test('can filter by release date range', async () => {
            let lowerBound = new Date('2002-01-01T00:00:00.000Z');
            let upperBound = new Date('2003-01-01T23:59:59.999Z');

            // Verify that test data has examples for all cases: below lower bound, above upper bound, and within bounds.
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({  
                searchTerm: '',
            });

            expect(noFilterResponse.status).toBe(200);
            expect(noFilterResponse.body.length).toBeGreaterThan(1);

            // Verify that test data has examples above upper bound
            expect(noFilterResponse.body.some((x: MediaSearchResult) => new Date(x.releaseDate) > upperBound)).toBe(true);
            // Verify that test data has examples below lower bound
            expect(noFilterResponse.body.some((x: MediaSearchResult) => new Date(x.releaseDate) < lowerBound)).toBe(true);
            // Verify that test data has examples within the bounds
            expect(noFilterResponse.body.some((x: MediaSearchResult) => new Date(x.releaseDate) >= lowerBound && new Date(x.releaseDate) <= upperBound)).toBe(true);

            const filterResponseUpperAndLowerBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        from: lowerBound,
                        to: upperBound
                    }
                }
            });

            expect(filterResponseUpperAndLowerBound.status).toBe(200);
            expect(filterResponseUpperAndLowerBound.body.length).toBeGreaterThanOrEqual(1);
            expect(filterResponseUpperAndLowerBound.body.some((x: MediaSearchResult) => new Date(x.releaseDate) < lowerBound || new Date(x.releaseDate) > upperBound)).toBe(false);

            const filterResponseUpperBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        to: upperBound
                    }
                }
            });

            expect(filterResponseUpperBound.status).toBe(200);
            expect(filterResponseUpperBound.body.length).toBeGreaterThanOrEqual(1);
            expect(filterResponseUpperBound.body.some((x: MediaSearchResult) => new Date(x.releaseDate) > upperBound)).toBe(false);

            const filterResponseLowerBound = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        from: lowerBound
                    }
                }
            });

            expect(filterResponseLowerBound.status).toBe(200);
            expect(filterResponseLowerBound.body.length).toBeGreaterThanOrEqual(1);
            expect(filterResponseLowerBound.body.some((x: MediaSearchResult) => new Date(x.releaseDate) < lowerBound)).toBe(false);
        });

        test('can filter by media genre (single & multiple)', async () => {
            // Verify that test data has examples with the genre 'Fantasy' and 'Sci-Fi' (genres used in tests below), and at least one other genre.
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                page: 0,
                pageSize: 100
            });

            expect(noFilterResponse.status).toBe(200);
            expect(noFilterResponse.body.length).toBeGreaterThanOrEqual(1);
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.genres.includes('Fantasy'))).toBe(true);
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.genres.includes('Sci-Fi'))).toBe(true);
            expect(noFilterResponse.body.some((x: MediaSearchResult) => x.genres.includes('Adventure'))).toBe(true);


            const singleGenreResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                filters: {
                    genres: ['Fantasy']
                }
            });

            expect(singleGenreResponse.status).toBe(200);
            expect(singleGenreResponse.body.length).toBeGreaterThanOrEqual(1);
            expect(singleGenreResponse.body.some((x: MediaSearchResult) => !x.genres.includes('Fantasy'))).toBe(false);

            let multipleGenreResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                filters: {
                    genres: ['Fantasy', 'Sci-Fi']
                }
            });

            expect(multipleGenreResponse.status).toBe(200);
            expect(multipleGenreResponse.body.length).toBeGreaterThanOrEqual(1);
            expect(multipleGenreResponse.body.some((x: MediaSearchResult) => !x.genres.includes('Fantasy') && !x.genres.includes('Sci-Fi'))).toBe(false);
        });

        test(`can only show media items available at a given location`, async () => {
            // Verify that test data contains examples of media items unavailable at a given location.
            // Also verify that test data contains examples of media items a other locations - test for breaking change.
            let locationId = 1;
            const noFilterResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
            });

            expect(noFilterResponse.status).toBe(200);
            expect(noFilterResponse.body.length).toBeGreaterThanOrEqual(1);
            // Verify that test data contains examples of media items unavailable at given location.
            expect(noFilterResponse.body.some((x : MediaSearchResult) => x.mediaStock.some((y : MediaStock) => y.locationId === locationId && y.stockCount === 0))).toBe(true);
            // Verify that test data contains examples of media items available at given location.
            expect(noFilterResponse.body.some((x : MediaSearchResult) => x.mediaStock.some((y : MediaStock) => y.locationId === locationId && y.stockCount > 0))).toBe(true);
            // Verify that test data contains examples of media items available at other locations.
            expect(noFilterResponse.body.some((x : MediaSearchResult) => x.mediaStock.some((y : MediaStock) => y.locationId !== locationId && y.stockCount > 0))).toBe(true);
            expect(noFilterResponse.body.some((x : MediaSearchResult) => x.mediaStock.some((y : MediaStock) => y.locationId !== locationId && y.stockCount === 0))).toBe(true);

            const availableAtLocationResponse = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                availableAtLocation: locationId,
                page: 0,
                pageSize: 100
            });

            expect(availableAtLocationResponse.status).toBe(200);
            expect(availableAtLocationResponse.body.length).toBeGreaterThanOrEqual(1);
            log(availableAtLocationResponse.body.map((x: MediaSearchResult) => x.mediaStock));
            expect(availableAtLocationResponse.body.every((x : MediaSearchResult) => x.mediaStock.some((y : MediaStock) => y.locationId === locationId && y.stockCount > 0))).toBe(true);
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

        test('return an error if the available at location is not a number', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: 'The Hobbit',
                availableAtLocation: 'not a number'
            });

            expect(response.status).toBe(400);
        });

        test('return an error if the release date range is not a valid date', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        from: 'not a date',
                        to: 'not a date'
                    }
                }
            });

            expect(response.status).toBe(400);
        });

        test('return an error if the release date range start is after the end', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        from: '2003-01-01',
                        to: '2002-01-01'
                    }
                }
            });

            expect(response.status).toBe(400);
        });

        test('return an error if the release date range start is in the future', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        from: '2025-01-01',
                        to: '2026-01-01'
                    }
                }
            });

            expect(response.status).toBe(400);
        });

        test('return an error if the release date range end is in the future', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                range: {
                    releaseDate: {
                        from: '2002-01-01',
                        to: '2026-01-01'
                    }
                }
            });

            expect(response.status).toBe(400);
        });

        test('return an error if an invalid genre filter is provided', async () => {
            const response = await agent.post('/search')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                searchTerm: '',
                filters: {
                    genres: ['not a valid genre']
                }
            });
        });
    });

    describe('200 GET /filters', () => {
        test('can get the search filters', async () => {
            const response = await agent.get('/filters');

            expect(response.status).toBe(200);
            log(response.body);
            expect(response.body.type).toEqual(Array.from(MediaSearchFilters.get('type')!));
            expect(response.body.genres).toEqual(Array.from(MediaSearchFilters.get('genres')!));
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
