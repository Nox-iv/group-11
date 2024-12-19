# Media Borrowing API

## Overview

The Media Borrowing API provides endpoints for managing media borrowing, renewal, and returns. In addition to the endpoints below, the API also provides a `GET` endpoint for retrieving branches by location ID. Users are bound to a location which can have several branches, therefore it's important that the API provides this information so that a client can provide a list of available branches to the user.

## Endpoints

### Borrow a Media Item

- **URL**: `/borrow`
- **Method**: `POST`
- **Request Body**:
  - `userId` (integer, required)
  - `mediaId` (integer, required)
  - `branchId` (integer, required)
  - `startDate` (string, date, required)
  - `endDate` (string, date, required)
- **Responses**:
  - `200 OK`: Media item borrowed successfully.
  - `400 Bad Request`: Errors in the request.

### Renew a Media Item

- **URL**: `/renew`
- **Method**: `POST`
- **Request Body**:
  - `mediaBorrowingRecordId` (integer, required)
  - `renewedEndDate` (string, date, required)
- **Responses**:
  - `200 OK`: Media item renewed successfully.
  - `400 Bad Request`: Errors in the request.

### Return a Media Item

- **URL**: `/return`
- **Method**: `POST`
- **Request Body**:
  - `mediaBorrowingRecordId` (integer, required)
- **Responses**:
  - `200 OK`: Media item returned successfully.
  - `400 Bad Request`: Errors in the request.

### Get Media Borrowing Records for a User

- **URL**: `/user/{userId}/records`
- **Method**: `GET`
- **Parameters**:
  - `userId` (integer, required)
  - `offset` (integer, optional)
  - `limit` (integer, optional)
- **Responses**:
  - `200 OK`: List of media borrowing records along with the branch opening hours and borrowing configuration.
    ```json
    [
      {
        "mediaBorrowingRecordId": 123,
        "startDate": "2023-01-01T00:00:00Z",
        "endDate": "2023-01-15T00:00:00Z",
        "renewals": 1,
        "mediaId": 456,
        "mediaType": "Book",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "assetUrl": "http://example.com/media/456",
        "branch": {
          "branchId": 789,
          "locationId": 101,
          "name": "Central Library",
          "openingHours": [
            [0, [[9, 17]]],
            [1, [[9, 17]]],
            [2, [[9, 17]]],
            [3, [[9, 17]]],
            [4, [[9, 17]]],
            [5, [[10, 14]]],
            [6, []]
          ],
          "borrowingConfig": {
            "maxRenewals": 3,
            "maxBorrowingPeriod": 14
          }
        }
      }
    ]
    ```
  - `400 Bad Request`: Errors in the request.

### Get Branches by Location ID 

- **URL**: `/location/{locationId}/branches`
- **Method**: `GET`
- **Parameters**:
  - `locationId` (integer, required)
- **Responses**:
  - `200 OK`: List of branches along with their opening hours and borrowing configuration.
    ```json
    [
      {
        "branchId": 789,
        "locationId": 101,
        "name": "Central Library",
        "openingHours": [
          [0, [[9, 17]]],
          [1, [[9, 17]]],
          [2, [[9, 17]]],
          [3, [[9, 17]]],
          [4, [[9, 17]]],
          [5, [[10, 14]]],
          [6, []]
        ],
        "borrowingConfig": {
          "maxRenewals": 3,
          "maxBorrowingPeriod": 14
        }
      }
    ]
    ```
  - `400 Bad Request`: Errors in the request.

## Error Handling

All endpoints return a `400 Bad Request` status code if there are errors in the request. The response body contains an array of error messages.

---