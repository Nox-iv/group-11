# Wishlist API

## Overview

The wishlist API handles requests from AML members to manage and create multiple wishlists for future borrowing, tracking status, and removing media items .

## Endpoints

### 1. Create a new wishlist

- **URL:** `/wishlist`
- **Method:** `POST`
- **Description:** create a wishlist for AML member.

#### Request Body Parameters:

- `wishlistName`(string, required)
- `member_id` (integer, required)  

#### Example Request:

```json 
{
    "wishlistName": "tech",
    "member_id": 2
}
```

#### Response:

- **Status Code:** `201 Created`
- **Body:**

  ```json
  {
    "status": 201,
    "message": "Wishlist created successfully"
  }
  ```

### 2. Add media to wishlist

- **URL:** `/wishlist/:id/media`
- **Method:** `POST`
- **Description:** add a media item to a selected wishlist.

#### Request Body Parameters:

- `media_id`(number, required)

#### Example Request:

```json 
{
    "media_id": 10
}
```
#### Response:

- **Status Code:** `201 Created`
- **Body:**

  ```json
  {
    "id": 80,
    "wishlist_id": 47,
    "wishlist_name": "My Books",
    "member_id": 1,
    "member_name": "John Doe",
    "media_id": 1,
    "created_at": "2025-01-04T19:37:52.814Z"
  }
  ```

### 3. Remove media from wishlist   

**URL:** `/wishlists/:wishlistId/media/:mediaId`
**Method:** DELETE
**Description:** Remove a specific media item from a wishlist.

#### Request Body Parameters:
None Required

#### Response:

- **Status Code:** `200 OK`
- **Body:**

 ```json 
{
     "message": "Wishlist was deleted"
}
```

4. Delete wishlist

**URL:** /wishlists/:id
**Method:** DELETE
**Description:** Delete an entire wishlist and its contents.

#### Request Body Parameters:
None required

#### Example Request:
No request body needed

#### Response:

- **Status Code:** `200 OK`
- **Body:**

 ```json 
{
     "message": "Wishlist was deleted"
}
```

5. Get specific wishlist with details

**URL:** /wishlists/:id
**Method:** GET
**Description:** Get details of a specific wishlist including media items.

#### Request Body Parameters:
None required

#### Example Request:
No request body needed

#### Response:

- **Status Code:** `200 OK`
- **Body:**


 ```json 
{
     "wishlist_id": 17,
    "wishlist_name": "Geography",
    "member_id": 3,
    "item_id": 17,
    "media_id": 5,
    "media_name": "Inception",
    "media_type": "",
    "availability": ""
}
 
 



