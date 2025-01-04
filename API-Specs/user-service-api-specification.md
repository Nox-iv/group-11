# Userservice API Specification

## Overview

The Userservice API allows clients to manage user registration, authentication, and user details. Below is a concise specification of the available endpoints.

---

## Endpoints

### 1. Register a New User

- **URL:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user in the system.

#### Request Body Parameters:

- `fname` (string, required): First name of the user.
- `sname` (string, required): Surname of the user.
- `email` (string, required): User's email address.
- `phone` (string, required): User's phone number.
- `branchLocationID` (number, required): Identifier for the branch location.
- `dob` (string, required): Date of birth in ISO format (YYYY-MM-DD).
- `password` (string, required): User's password.

#### Example Request:

```json
{
  "fname": "Jane",
  "sname": "Doe",
  "email": "jane.doe@example.com",
  "phone": "+1234567890",
  "branchLocationID": 1,
  "dob": "1995-05-15",
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

### 2. User Login

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a user and initiates a session.

#### Request Body Parameters:

- `email` (string, required): User's email address.
- `password` (string, required): User's password.

#### Example Request:

```json
{
  "email": "jane.doe@example.com",
  "password": "securePassword123"
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "userId": "123",
    "branchLocationID": "1",
    "role": "user"
  }
  ```

---

### 3. Verify Email Address

- **URL:** `/verify-email`
- **Method:** `POST`
- **Description:** Verifies the user's email using a verification code.

#### Request Body Parameters:

- `verificationCode` (string, required): The verification code sent to the user's email.

#### Example Request:

```json
{
  "verificationCode": "ABCDE12345"
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "status": 200,
    "message": "Email verified successfully"
  }
  ```

---

### 4. Get User Role

- **URL:** `/get-user-role`
- **Method:** `POST`
- **Description:** Retrieves the role associated with a user.

#### Request Body Parameters:

- `userId` (number, required): The unique identifier of the user.

#### Example Request:

```json
{
  "userId": 123
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "role": "user"
  }
  ```

---

### 5. Get User Email

- **URL:** `/get-user-email`
- **Method:** `POST`
- **Description:** Retrieves the email address of a user.

#### Request Body Parameters:

- `userId` (number, required): The unique identifier of the user.

#### Example Request:

```json
{
  "userId": 123
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "email": "jane.doe@example.com"
  }
  ```

---

### 6. Check if User Exists

- **URL:** `/check-user-exists`
- **Method:** `POST`
- **Description:** Checks whether a user with the given ID exists.

#### Request Body Parameters:

- `userId` (number, required): The unique identifier of the user.

#### Example Request:

```json
{
  "userId": 123
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "exists": true
  }
  ```

---

### 7. Update Own User Details

- **URL:** `/user-update-self`
- **Method:** `POST`
- **Description:** Allows a user to update their own details.

#### Request Body Parameters:

- `userID` (number, required): The unique identifier of the user.
- `fname` (string, optional): First name.
- `sname` (string, optional): Surname.
- `phone` (string, optional): Phone number.

#### Example Request:

```json
{
  "userID": 123,
  "fname": "Jane",
  "sname": "Smith",
  "phone": "+0987654321"
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "status": 200,
    "message": "User details updated successfully"
  }
  ```

---

### 8. Admin Update User Details

- **URL:** `/admin-update-user`
- **Method:** `POST`
- **Description:** Allows an admin to update another user's details.

#### Request Body Parameters:

- `currentUserID` (number, required): The admin user's ID performing the update.
- `targetUserID` (number, required): The ID of the user to update.
- `fname` (string, optional): First name.
- `sname` (string, optional): Surname.
- `phone` (string, optional): Phone number.
- `branchLocationID` (number, optional): Branch location ID.
- `dob` (string, optional): Date of birth in ISO format.
- `role` (string, optional): Role to assign to the user.
- `email` (string, optional): Email address.

#### Example Request:

```json
{
  "currentUserID": 1,
  "targetUserID": 123,
  "fname": "Jane",
  "sname": "Doe",
  "branchLocationID": 2,
  "role": "admin"
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "status": 200,
    "message": "User details updated successfully"
  }
  ```

---

### 9. Get User Details

- **URL:** `/get-user-details`
- **Method:** `POST`
- **Description:** Retrieves detailed information about a user.

#### Request Body Parameters:

- `userID` (number, required): The unique identifier of the user.

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
    "user": {
      "userID": 123,
      "fname": "Jane",
      "sname": "Doe",
      "email": "jane.doe@example.com",
      "phone": "+1234567890",
      "branchLocationID": 1,
      "dob": "1995-05-15",
      "is_verified": true,
      "role": "user"
    }
  }
  ```

---

### 10. Get All Users

- **URL:** `/get-all-users`
- **Method:** `POST`
- **Description:** Retrieves a list of all users. Accessible only by admin users.

#### Request Body Parameters:

- `currentUserID` (number, required): The ID of the admin making the request.

#### Example Request:

```json
{
  "currentUserID": 1
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "users": [
      {
        "userID": 123,
        "fname": "Jane",
        "sname": "Doe",
        "role": "user"
      },
      {
        "userID": 124,
        "fname": "John",
        "sname": "Smith",
        "role": "admin"
      }
    ]
  }
  ```

---

### 11. Get All Users Paginated

- **URL:** `/get-all-users-paginated`
- **Method:** `POST`
- **Description:** Retrieves a paginated list of users. Accessible only by admin users.

#### Request Body Parameters:

- `currentUserID` (number, required): The ID of the admin making the request.
- `limit` (number, required): Maximum number of users to return.
- `offset` (number, required): Number of users to skip before starting to collect the result set.

#### Example Request:

```json
{
  "currentUserID": 1,
  "limit": 10,
  "offset": 0
}
```

#### Response:

- **Status Code:** `200 OK`
- **Body:**

  ```json
  {
    "users": [
      {
        "userID": 125,
        "fname": "Alice",
        "sname": "Johnson",
        "role": "user"
      },
      {
        "userID": 126,
        "fname": "Bob",
        "sname": "Williams",
        "role": "user"
      }
    ]
  }
  ```

---