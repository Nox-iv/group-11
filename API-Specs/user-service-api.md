# User Service API Endpoints

## 1) Register User

**Endpoint**:  
POST /register

**Description**:  
Registers a new user in the system.

**Headers**:  
- Content-Type: application/json

**Request Body**:
```json
{
  "fname": "John",
  "sname": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "branchLocationID": 1,
  "dob": "1990-01-01",
  "password": "password123"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "userId": 1
}
```

---

## 2) Login User

**Endpoint**:  
POST /login

**Description**:  
Logs a user in by checking credentials.

**Headers**:  
- Content-Type: application/json

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "userId": 1,
  "branchLocationId": 10,
  "role": "user",
  "message": "Login successful"
}
```
(If not verified or wrong password, an appropriate error or message is returned.)

---

## 3) Verify Email

**Endpoint**:  
POST /verify

**Description**:  
Verifies a user’s email given a verification code.

**Headers**:  
- Content-Type: application/json

**Request Body**:
```json
{
  "code": "ABC123"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "message": "Email verified successfully"
}
```
(If code is invalid or expired, an error message is returned.)

---

## 4) Check User Exists

**Endpoint**:  
GET /user-exists/:userId

**Description**:  
Checks if a user exists by user ID.

**Headers**:  
- Content-Type: application/json

**Response**:
- Status: 200 OK
- Body:
```json
true
```
(Or false if user not found.)

---

## 5) Get User Details

**Endpoint**:  
GET /users/:userId

**Description**:  
Retrieves user details by user ID.

**Headers**:  
- Content-Type: application/json

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

## 6) Update Self

**Endpoint**:  
PATCH /users/:userId

**Description**:  
User updates their own profile details. The user can only update their fname, sname, and phone.

**Headers**:  
- Content-Type: application/json

**Request Body**:
```json
{
  "fname": "John",
  "sname": "Doe",
  "phone": "0987654321"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "message": "User updated successfully"
}
```

---

## 7) Update Password

**Endpoint**:  
PATCH /users/:userId/password

**Description**:  
Allows the user to change their password (via the auth service).

**Headers**:  
- Content-Type: application/json

**Request Body**:
```json
{
  "oldPassword": "oldPass123",
  "newPassword": "newPass123"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "message": "Password updated successfully"
}
```
(If the old password is wrong, an error is returned.)

---

## 8) Admin Update User

**Endpoint**:  
PATCH /admin/users/:targetUserId

**Description**:  
Admin updates a user’s info (role, branch location, email, etc.).

**Headers**:  
- Content-Type: application/json

**Request Body**:
```json
{
  "fname": "Jane",
  "sname": "Smith",
  "role": "admin",
  "email": "jane.smith@example.com"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "message": "User updated by admin"
}
```

---

## 9) Get All Users

**Endpoint**:  
GET /admin/users

**Description**:  
Admin retrieves all users in the system.

**Headers**:  
- Content-Type: application/json

**Response**:
- Status: 200 OK
- Body: An array of user objects.

---

## 10) Get All Users (Paginated)

**Endpoint**:  
GET /admin/users/paginated?limit=10&offset=0

**Description**:  
Admin retrieves a paginated list of users.

**Headers**:  
- Content-Type: application/json

**Query Parameters**:  
- limit (number)  
- offset (number)

**Response**:
- Status: 200 OK
- Body: An array of user objects limited and offset by the query parameters.