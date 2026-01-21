# Auth Service API

**Base URL:** `/api/auth`  
**Port:** 3011

---

## Authentication Endpoints

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "customer"  // optional: customer, seller, admin
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

---

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

---

### Google OAuth

```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_id_token"
}
```

---

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

**Response (200):**

```json
{
  "success": true,
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token"
}
```

---

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

---

## Profile Endpoints

### Get Profile

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "avatar": "https://...",
    "isEmailVerified": true
  }
}
```

---

### Update Profile

```http
PUT /api/auth/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Updated",
  "avatar": "https://new-avatar.jpg"
}
```

---

### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## Email Verification

### Send Verification Email

```http
POST /api/auth/send-verification-email
Authorization: Bearer <access_token>
```

---

### Verify Email (Authenticated)

```http
POST /api/auth/verify-email
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "otp": "123456"
}
```

---

### Verify Email by Token (From Email Link)

```http
POST /api/auth/verify-email-token
Content-Type: application/json

{
  "token": "verification_token"
}
```

---

### Validate Email Token

```http
GET /api/auth/validate-email-token/:token
```

---

## Password Reset

### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

### Validate Reset Token

```http
GET /api/auth/validate-reset-token/:token
```

---

### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "new_password"
}
```

---

## User Endpoints

**Base URL:** `/api/users`

### Get User by ID

```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

---

### List Users (Admin)

```http
GET /api/users
Authorization: Bearer <admin_access_token>

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- role: string (customer, seller, admin)
- search: string
```

---

## Address Endpoints

**Base URL:** `/api/addresses`

### Get User Addresses

```http
GET /api/addresses
Authorization: Bearer <access_token>
```

---

### Create Address

```http
POST /api/addresses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "label": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

---

### Update Address

```http
PUT /api/addresses/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "label": "Work",
  "street": "456 Office Ave"
}
```

---

### Delete Address

```http
DELETE /api/addresses/:id
Authorization: Bearer <access_token>
```

---

## Error Responses

| Code | Message                             |
| ---- | ----------------------------------- |
| 400  | Validation error / Bad request      |
| 401  | Invalid credentials / Token expired |
| 403  | Account deactivated / Forbidden     |
| 404  | User not found                      |
| 500  | Internal server error               |

**Error Format:**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Valid email is required" }]
}
```

---

## Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Auth service is running",
  "timestamp": "2026-01-20T10:00:00.000Z"
}
```

---

## Swagger Documentation

Available at: `http://localhost:3011/api-docs`
