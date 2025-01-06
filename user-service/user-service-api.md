# User Service API Documentation

## 1) Register User

**Endpoint**: POST /register  
**Description**: Registers a new user  

**Headers**:  
- `x-api-key`: [User service API key] (required)  
- `Content-Type`: application/json  

**Query Parameters**:  
(None)

**Request Body**:
```json
{
  "fname": "John",
  "sname": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "branchLocationID": 1,
  "dob": "1990-01-01",
  "password": "secretPassword"
}
```

**Response**:  
- Status: 200 OK  
- Body:
```json
{
  "success": true,
  "userId": 123
}
```

---

## 2) Login User

**Endpoint**: POST /login  
**Description**: Checks user credentials and logs them in  

**Headers**:  
- `x-api-key`: [User service API key] (required)  
- `Content-Type`: application/json  

**Query Parameters**:  
(None)

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "secretPassword"
}
```

**Response**:  
- Status: 200 OK  
- Body:
```json
{
  "success": true,
  "userId": 123,
  "branchLocationId": 1,
  "role": "user",
  "message": "Login successful"
}
```
(If invalid, returns an error message.)

---

## 3) Verify Email

**Endpoint**: GET /verify-email
**Description**: Verifies a user’s email  

**Headers**:  
- `x-api-key`: [User service API key] (required)

**Query Parameters**:  
- `verificationCode` (string, required): The code of the user to verify

**Request Body**:  
(None)

**Response**:  
- Status: 200 OK  
- Body:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
(If the code is invalid or expired, an error is returned.)

---

## 4) Check User Exists

**Endpoint**: GET /check-user-exists  
**Description**: Checks if a user exists by ID  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Query Parameters**:  
- `userId` (string, required): The ID of the user to check

**Request Body**:  
(None)

**Response**:
- Status: 200 OK  
- Body:
```json
{
  "exists": true
}
```
(Or false if user not found.)

---

## 5) Get User Email

**Endpoint**: GET /get-user-email  
**Description**: Retrieves a user’s email  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Query Parameters**:  
- `userId` (string, required)

**Request Body**:  
(None)

**Response**:  
- Status: 200 OK  
- Body:
```json
{
  "email": "user@example.com"
}
```
(Or 404 if user not found.)

---

## 6) Get User Role

**Endpoint**: GET /get-user-role  
**Description**: Retrieves a user’s role  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Query Parameters**:  
- `userId` (string, required)

**Response**:  
- Status: 200 OK  
- Body:
```json
{
  "role": "admin"
}
```
(Or 404 if user not found.)

---

## 7) Get User Details

**Endpoint**: GET /get-user-details  
**Description**: Retrieves user details  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Query Parameters**:  
- `userId` (string, required)

**Response**:  
- Status: 200 OK  
- Body:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "branch_location_id": 1,
  "date_of_birth": "1990-01-01",
  "user_role": "user",
  "is_verified": true
}
```

---

## 8) Update Self

**Endpoint**: PATCH /user-update-self  
**Description**: User updates their own profile details  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Request Body**:
```json
{
  "userId": 123,
  "fname": "John",
  "sname": "Doe",
  "phone": "1234567890"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

## 9) Update User Password

**Endpoint**: PATCH /user-update-password  
**Description**: Updates the user’s password if the old one is correct  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Request Body**:
```json
{
  "userId": 123,
  "oldPassword": "oldPass",
  "newPassword": "newPass"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```
(If the old password is wrong, responds with an error message.)

---

## 10) Admin Update User

**Endpoint**: PATCH /admin-update-user  
**Description**: Admin updates a user’s info  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Request Body**:
```json
{
  "adminId": 456,
  "targetUserId": 123,
  "fname": "Jane",
  "sname": "Smith",
  "phone": "9876543210",
  "branchLocationID": 2,
  "dob": "1992-12-31",
  "role": "admin",
  "email": "jane.smith@example.com"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "message": "User updated by admin"
}
```

---

## 11) Get All Users

**Endpoint**: GET /get-all-users  
**Description**: Admin retrieves all users  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Query Parameters**:
- `adminId` (string, required)

**Response**:
- Status: 200 OK
- Body: 
```json
[
  {
    "user_id": 1,
    "first_name": "User1",
    "last_name": "Example",
    "email": "user1@example.com"
  },
  ...
]
```

---

## 12) Get All Users Paginated

**Endpoint**: GET /get-all-users-paginated  
**Description**: Admin retrieves a paginated list of users  

**Headers**:  
- `x-api-key`: [User service API key] (required)
- `Authorization`: Bearer [token] (required)

**Query Parameters**:  
- `adminId` (string, required)  
- `limit` (number, required)  
- `offset` (number, required)

**Response**:
- Status: 200 OK  
- Body: 
```json
[
  {
    "user_id": 1,
    "first_name": "User1",
    "last_name": "Example",
    "email": "user1@example.com"
  },
  ...
]
```
