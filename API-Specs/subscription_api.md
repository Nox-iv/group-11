# Subscription API 

## Overview
The subscription API provides endpoints for both AML members and accountants to manage subscriptions. Members can subscribe and manage their own subscriptions, while accountants can oversee financial aspects of subscriptions and manange subscriptions in general.

## Member Endpoints

### 1.Retrieve subscription type 

- **URL:** `/subscription/types`
- **Method:** `GET`
- **Description:** Retrieve all available subscription types.

#### Request Body Parameters:
None

#### Response:

- **Status Code:** `201 Created`
- **Body:**

  ```json
  {
    "subid": 1,
    "subtype": "Basic",
    "price": "9.99",
    "duration": {
      "months": 1
  }}
  ``` 

### 2. Subscribe to library
- **URL:** `/subscription`
- **Method:** `POST`
- **Description:** AML member subscribe to a subscription plan.

#### Request Body Parameters:
- `member_id` (integer, required)
- `subscription_id`(integer, required)

#### Example Request:

```json 
{
  "member_id": 12,
  "subid": 1
}
```

#### Response:

- **Status Code:** `201 Created`
- **Body:** 

  ```json
  {
    "id": 36,
    "member_id": 678,
    "subid": 1,
    "start_date": "2025-01-04T20:41:52.623Z",
    "end_date": "2025-02-04T20:41:52.623Z",
    "status": "active",
    "auto_renew": true,
    "first_name": null,
    "last_name": null
  }
  ```

### 3. Update Subscription
- **URL:** `/subscription`
- **Method:** `PUT`
- **Description:** AML member update the subscritpion plan

#### Request Body Parameters:
- `member_id` (integer, required)
- `subscription_id`(integer, required)

#### Example Request:

```json 
{
  "member_id": 45,
  "subid": 3
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "id": 14,
    "member_id": 45,
    "subid": 3,
    "start_date": "2025-01-04T20:46:04.182Z",
    "end_date": "2026-01-04T20:46:04.182Z",
    "status": "active",
    "auto_renew": true,
    "first_name": null,
    "last_name": null
  }
  ```

### 4. Remove Subscription
- **URL:** `/subscription`
- **Method:** `DELETE`
- **Description:** AML member delete the subscritpion plan

#### Request Body Parameters:
- `member_id` (integer, required)
- `subid`(integer, required)

#### Example Request:

```json 
{
  "member_id": 1,
  "subid": 3
}
``` 

#### Response:

- **Status Code:** `200 OK`
- **Body:**
```json
  {
    "message": "Subscription removed successfully"
  }
  ```


## Accountant Endpoints

### 1.  Get Member's subscription list
- **URL:** `/subscription/memberSub`
- **Method:** `GET`
- **Description:** Retrieve the subscription details 

#### Request Body Parameters:
None

#### Example Request:
None

#### Response:

- **Status Code:** `200 OK`
- **Body:**
```json
  {
   "id": 15,
    "member_id": 49,
    "subid": 1,
    "start_date": "2024-12-07T22:49:24.043Z",
    "end_date": "2025-01-07T22:49:24.043Z",
    "status": "active",
    "auto_renew": true,
    "first_name": null,
    "last_name": null,
    "subtype": "Basic",
    "price": "9.99",
    "member_name": "undefined undefined"
  }
  ```
### 2. Upgrade or downgrade member subscription
- **URL:** `/subscription/memberSub`
- **Method:** `PUT`
- **Description:** Edit a member's subscription plan 

#### Request Body Parameters:
- member_id (integer, required)
- new_subid (integer, required)

#### Example Request:
```json 
{
  "member_id": 1,
  "new_subid": 2
}
``` 
#### Response:

**Status Code:** `200 OK`
- **Body:**
```json
  {
    "id": 12,
    "member_id": 1,
    "subid": 2,
    "start_date": "2025-01-04T21:07:23.344Z",
    "end_date": "2025-04-04T20:07:23.344Z",
    "status": "active",
    "auto_renew": false,
    "first_name": null,
    "last_name": null
  }
  ```

### 3.  Get all billing records
- **URL:** `/subscription/memberSub/billing`
- **Method:** `GET`
- **Description:** Retrieve all billing records for subscriptions.

#### Request Body Parameters:
None

#### Example Request:
None

#### Response:

- **Status Code:** `200 OK`
- **Body:**
```json
  {
    "billing_id": 27,
    "subscription_id": 36,
    "payment_amount": "9.99",
    "payment_method": null,
    "payment_status": "pending",
    "billing_date": "2025-01-04T20:41:52.641Z",
    "member_id": 678,
    "subtype": "Basic",
    "price": "9.99"
  }
  ```

### 4. Update billing status
- **URL:** `/subscription/memberSub/billing/:id`
- **Method:** `PUT`
- **Description:** Update the status of a specific billing record 

#### Request Body Parameters
- status (string, required)

#### Example Request:
```json 
{
   "status": "completed"
}
``` 

#### Response:

- **Status Code:** `200 OK`
- **Body:** 
```json
  {
    "billing_id": 9,
    "subscription_id": 6,
    "payment_amount": "49.99",
    "payment_method": "credit_card",
    "payment_status": "completed",
    "billing_date": "2024-12-05T13:36:21.470Z"
  }
  ```