# Auth Service API Endpoints

## 1) Register Credentials

**Endpoint**:  
POST /register

**Description**:  
Registers new credentials for a user.

**Headers**:  
- x-api-key: [Auth service API key] (required)  
- Content-Type: application/json  

**Request Body**:
```json
{
  "userId": "123",
  "password": "setPasswordHere"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "success": true,
  "message": "User credentials registered."
}
```

---

## 2) Check Password

**Endpoint**:  
POST /check-password

**Description**:  
Checks if the provided password matches the existing credentials.

**Headers**:  
- x-api-key: [Auth service API key] (required)  
- Content-Type: application/json  

**Request Body**:
```json
{
  "userId": "123",
  "password": "userPassword"
}
```

**Response**:
- Status: 200 OK
- Body:
```json
{
  "valid": true
}
```
(If invalid, it will return { "valid": false })

---

## 3) Update User Password

**Endpoint**:  
PATCH /update-user-password

**Description**:  
Updates a user's password if the old password is correct.

**Headers**:  
- x-api-key: [Auth service API key] (required)  
- Content-Type: application/json  

**Request Body**:
```json
{
  "userId": "123",
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
  "message": "Password updated successfully."
}
```
(If the old password is wrong, responds with an error message.)