# Media Search API

## Overview

The Media Search API provides endpoints for searching media items, retrieving search filters, and fetching media details by ID.

## Endpoints

### Search Media

- **URL**: `/search`
- **Method**: `POST`
- **Request Body**:
  - `searchTerm` (string, optional): The term to search for.
  - `page` (integer, optional, default: 0): The page number for pagination.
  - `pageSize` (integer, optional, default: 10): The number of items per page.
  - `filters` (object, optional): Additional filters to apply to the search.
  - `range` (object, optional): Range filters, e.g., `releaseDate`.
    - `releaseDate.from` (string, date, optional): Start date for release date range.
    - `releaseDate.to` (string, date, optional): End date for release date range.
  - `availableAtLocation` (integer, optional): Only retrieve items available at the given location ID.
- **Responses**:
  - `200 OK`: Returns the total number of hits and the list of media documents.
    - **Example Response**:
      ```json
      {
        "totalHits": 100,
        "data": [
          {
            "mediaId": 1,
            "title": "Example Book",
            "type": "Book",
            "author": "John Doe",
            "description": "An example book description.",
            "releaseDate": "2023-01-01",
            "imageUrl": "http://example.com/image.jpg",
            "genres": ["Adventure", "Fantasy"],
            "mediaStock": [
              {
                "locationId": 101,
                "locationName": "Main Library",
                "stockCount": 5
              }
            ]
          }
        ]
      }
      ```
  - `400 Bad Request`: Returns errors if the request parameters are invalid.
  - `500 Internal Server Error`: Returns an error message if an unexpected error occurs.

## Valid Filters

The API supports the following filters, which can be retrieved from the `/filters` endpoint:

- **type**: The type of media item.
  - Allowed values: `Book`, `Movie`, `Game`
  
- **genres**: The genre of the media item.
  - Allowed values: `Action`, `Adventure`, `Animation`, `Comedy`, `Crime`, `Drama`, `Fantasy`, `Horror`, `Mystery`, `Romance`, `Sci-Fi`, `Thriller`, `Western`, `Other`

Note: There is no outright constraint on the filters since it's likely that these fields will be updated frequently, however the filter validation logic will reject any filters that do not match the allowed values listed above. A mapping of valid filters and allowed values can be retrieved from the `/filters` endpoint which is described below.

### Get Search Filters

- **URL**: `/filters`
- **Method**: `GET`
- **Responses**:
  - `200 OK`: Returns the available search filters.
    - **Example Response**:
      ```json
      {
        "type": ["Book", "Movie", "Game"],
        "genres": ["Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Western", "Other"]
      }
      ```
  - `500 Internal Server Error`: Returns an error message if an unexpected error occurs.

### Get Media by ID

- **URL**: `/search/{mediaId}`
- **Method**: `GET`
- **Parameters**:
  - `mediaId` (integer, required): The ID of the media item to retrieve.
- **Responses**:
  - `200 OK`: Returns the media item details.
    - **Example Response**:
      ```json
      {
        "data": {
          "mediaId": 1,
          "title": "Example Book",
          "type": "Book",
          "author": "John Doe",
          "description": "An example book description.",
          "releaseDate": "2023-01-01",
          "imageUrl": "http://example.com/image.jpg",
          "genres": ["Adventure", "Fantasy"],
          "mediaStock": [
            {
              "locationId": 101,
              "locationName": "Main Library",
              "stockCount": 5
            }
          ]
        }
      }
      ```
  - `400 Bad Request`: Returns errors if the media ID is invalid.
  - `500 Internal Server Error`: Returns an error message if an unexpected error occurs.

## Error Handling

All endpoints return a `400 Bad Request` status code if there are errors in the request. The response body contains an array of error messages. A `500 Internal Server Error` status code is returned for unexpected errors, with the error message in the response body.
