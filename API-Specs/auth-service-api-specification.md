
# Authservice API Specification

## Overview

The Authservice API provides endpoints for user authentication and account management. Below is a concise specification of the available endpoints.

---

## Endpoints

### 1. Register User Credentials

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Registers user authentication credentials.

#### Request Body Parameters:

- `userID` (number, required): Unique identifier of the user.
- `password` (string, required): User's password.

#### Example Request:

```json
{
  "userID": 123,
  "password": "securePassword123"
}
```

#### Response:

- **Status Code:** `201 Created`
- **Body:**

  ```json
  {
    "status": 201,
    "message": "User registered successfully"
  }
  ```

---

### 2. Check Password

- **URL:** `/check-password`
- **Method:** `POST`
- **Description:** Verifies if the provided password matches the stored password for a user.

#### Request Body Parameters:

- `userID` (number, required): Unique identifier of the user.
- `password` (string, required): Password to verify.

#### Example Request:

```json
{
  "userID": 123,
  "password": "securePassword123"
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "status": 200,
    "message": "Password correct"
  }
  ```

---

### 3. Change Password

- **URL:** `/change-password`
- **Method:** `POST`
- **Description:** Allows a user to change their password.

#### Request Body Parameters:

- `userID` (number, required): Unique identifier of the user.
- `newPassword` (string, required): New password to set.

#### Example Request:

```json
{
  "userID": 123,
  "newPassword": "newSecurePassword456"
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "status": 200,
    "message": "Password changed successfully"
  }
  ```

---

### 4. Delete Account

- **URL:** `/delete-account`
- **Method:** `POST`
- **Description:** Deletes a user's authentication credentials.

#### Request Body Parameters:

- `userID` (number, required): Unique identifier of the user.

#### Example Request:

```json
{
  "userID": 123
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "status": 200,
    "message": "Account deleted successfully"
  }
  ```

---