# Users API — Register Endpoint

## Endpoint

- URL: `/api/v1/users/register`
- Method: `POST`
- Auth: None

## Description

Create a new user account. Validates required fields, ensures username/email uniqueness, hashes password before storing, and returns the created user object (password and refreshToken excluded).

## Request Headers

- `Content-Type: application/json`

## Request Body

- `fullName` (string) — required, min length 3
- `email` (string) — required, unique, min length 5
- `username` (string) — required, unique, min length 3; stored lowercase
- `password` (string) — required

Example:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "StrongPassword123"
}
```

## Responses

- 201 Created
  - Description: User created successfully
  - Body (example):

  ```json
  {
    "status": 200,
    "data": {
      "_id": "60f...abc",
      "fullName": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "createdAt": "2026-01-31T...",
      "updatedAt": "2026-01-31T..."
    },
    "message": "User created successfully"
  }
  ```

- 400 Bad Request
  - Cause: Missing or empty required fields
  - Message: `"All fields are required"`

- 409 Conflict
  - Cause: Username or email already exists
  - Message: `"User already exists"`

- 500 Internal Server Error
  - Cause: Server error during creation
  - Message: `"User creation failed"`

## Example cURL

```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","username":"johndoe","password":"StrongPassword123"}'
```

## Users API — Login Endpoint

## Endpoint

- URL: `/api/v1/users/login`
- Method: `POST`
- Auth: None

## Description

Authenticate a user using username or email and password. On success, sets `accessToken` and `refreshToken` cookies (httpOnly, secure) and returns the authenticated user (password and refreshToken excluded) along with tokens.

## Request Headers

- `Content-Type: application/json`

## Request Body

- `username` (string) — required if `email` is not provided
- `email` (string) — required if `username` is not provided
- `password` (string) — required

Example (username):

```json
{
  "username": "johndoe",
  "password": "StrongPassword123"
}
```

Example (email):

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

## Responses

- 200 OK
  - Description: User logged in successfully
  - Body (example):

  ```json
  {
    "status": 200,
    "data": {
      "user": {
        "_id": "60f...abc",
        "fullName": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "createdAt": "2026-01-31T...",
        "updatedAt": "2026-01-31T..."
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "User logged in successfully"
  }
  ```

  - Cookies set: `accessToken`, `refreshToken` (httpOnly, secure)

- 400 Bad Request
  - Cause: Missing both username and email
  - Message: `"Username or email is required"`

- 401 Unauthorized
  - Cause: Incorrect password
  - Message: `"Invalid password"`

- 404 Not Found
  - Cause: User not found
  - Message: `"User not found"`

- 500 Internal Server Error
  - Cause: Token generation or server error
  - Message: `"Token generation failed"` or a generic server error message

## Example cURL

```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"StrongPassword123"}'
```

## Users API — Profile Endpoint

### Endpoint

- URL: `/api/v1/users/profile`
- Method: `GET`
- Auth: Required (accessToken)

### Description

Fetch the authenticated user's profile. Response excludes `password` and `refreshToken`.

### Request Headers

- `Authorization: Bearer <accessToken>` (or send cookie `accessToken`)

### Responses

- 200 OK
  - Body (example):
  ```json
  {
    "status": 200,
    "data": {
      "_id": "60f...abc",
      "fullName": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "createdAt": "2026-01-31T...",
      "updatedAt": "2026-01-31T..."
    },
    "message": "User profile fetched successfully"
  }
  ```
- 401 Unauthorized — missing/invalid access token
- 404 Not Found — user not found
- 500 Internal Server Error — server error

### Example cURL

```bash
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer <accessToken>"
```

## Users API — Logout Endpoint

### Endpoint

- URL: `/api/v1/users/logout`
- Method: `POST`
- Auth: Required (accessToken)

### Description

Logs out the authenticated user by clearing `accessToken` and `refreshToken` cookies and removing the stored refresh token from the database.

### Request Headers

- `Authorization: Bearer <accessToken>` (or send cookie `accessToken`)

### Responses

- 200 OK
  - Body (example):
  ```json
  {
    "status": 200,
    "data": {},
    "message": "Logout successful"
  }
  ```
- 401 Unauthorized — missing/invalid access token
- 404 Not Found — user not found
- 500 Internal Server Error — server error

### Example cURL

```bash
curl -X POST http://localhost:8000/api/v1/users/logout \
  -H "Authorization: Bearer <accessToken>"
```

## Users API — Refresh Access Token Endpoint

### Endpoint

- URL: `/api/v1/users/refresh-token`
- Method: `POST`
- Auth: None (uses refresh token)

### Description

Accepts a refresh token (from cookie `refreshToken` or request body) and issues new `accessToken` and `refreshToken`. New tokens are saved and sent back in cookies (`httpOnly`, `secure`) and in the response body.

### Request Headers

- `Content-Type: application/json` (if sending token in body)
- or send cookie: `refreshToken=<token>`

### Request Body (optional)

- `refreshToken` (string) — optional if token is sent in cookie

Example:

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Responses

- 200 OK
  - Body (example):

  ```json
  {
    "status": 200,
    "data": {
      "accessToken": "newAccessToken...",
      "refreshToken": "newRefreshToken..."
    },
    "message": "Access token refreshed successfully"
  }
  ```

  - Cookies set: `accessToken`, `refreshToken` (httpOnly, secure)

- 401 Unauthorized — missing refresh token or invalid/expired token
- 404 Not Found — user associated with token not found
- 500 Internal Server Error — server error / token generation failed

### Example cURL (using cookie)

```bash
curl -X POST http://localhost:8000/api/v1/users/refresh-token \
  --cookie "refreshToken=<refreshToken>"
```

### Example cURL (using JSON body)

```bash
curl -X POST http://localhost:8000/api/v1/users/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

## Captains API — Register Endpoint

### Endpoint

- URL: `/api/v1/captains/register`
- Method: `POST`
- Auth: None

### Description

Create a new captain account and register their vehicle. Validates required fields, ensures email/username/vehicle plate uniqueness, hashes password before storing, and returns the created captain object (password and refreshToken excluded).

### Request Headers

- `Content-Type: application/json`

### Request Body

- `fullName` (string) — required
- `email` (string) — required, unique
- `username` (string) — required, unique; stored lowercase
- `password` (string) — required
- `vehicle` (object) — required
  - `plate` (string) — required, unique
  - other vehicle fields (optional): `model`, `color`, etc.

Example:

```json
{
  "fullName": "Jane Captain",
  "email": "jane.captain@example.com",
  "username": "janecaptain",
  "password": "StrongPassword123",
  "vehicle": {
    "plate": "ABC-1234",
    "model": "Toyota Prius",
    "color": "White"
  }
}
```

### Responses

- 201 Created
  - Description: Captain created successfully
  - Body (example):

  ```json
  {
    "status": 200,
    "data": {
      "_id": "60f...abc",
      "fullName": "Jane Captain",
      "email": "jane.captain@example.com",
      "username": "janecaptain",
      "vehicle": {
        "plate": "ABC-1234",
        "model": "Toyota Prius",
        "color": "White"
      },
      "createdAt": "2026-01-31T...",
      "updatedAt": "2026-01-31T..."
    },
    "message": "Captain created successfully"
  }
  ```

- 400 Bad Request
  - Cause: Missing/empty required fields
  - Message: `"All fields are required"`
  - OR Cause: Email, username, or vehicle plate already in use
  - Message: `"Email, Username or Vehicle Plate already in use"`

- 500 Internal Server Error
  - Cause: Server error during creation
  - Message: `"Captain creation failed"`

### Example cURL

```bash
curl -X POST http://localhost:8000/api/v1/captains/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jane Captain","email":"jane.captain@example.com","username":"janecaptain","password":"StrongPassword123","vehicle":{"plate":"ABC-1234","model":"Toyota Prius","color":"White"}}'
```

## Captains API — Login Endpoint

### Endpoint

- URL: `/api/v1/captains/login`
- Method: `POST`
- Auth: None

### Description

Authenticate a captain using username or email and password. On success, sets `accessToken` and `refreshToken` cookies (httpOnly, secure) and returns the authenticated captain (password and refreshToken excluded) along with tokens.

### Request Headers

- `Content-Type: application/json`

### Request Body

- `username` (string) — required if `email` is not provided
- `email` (string) — required if `username` is not provided
- `password` (string) — required

Example:

```json
{ "username": "janecaptain", "password": "StrongPassword123" }
```

### Responses

- 200 OK
  - Body (example):

  ```json
  {
    "status": 200,
    "data": {
      "captain": {
        "_id": "60f...abc",
        "fullName": "Jane Captain",
        "email": "jane.captain@example.com",
        "username": "janecaptain",
        "vehicle": {
          "plate": "ABC-1234",
          "model": "Toyota Prius",
          "color": "White"
        },
        "createdAt": "2026-01-31T...",
        "updatedAt": "2026-01-31T..."
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "message": "Captain logged in successfully"
  }
  ```

  - Cookies set: `accessToken`, `refreshToken` (httpOnly, secure)

- 400 Bad Request — missing both username and email
- 401 Unauthorized — incorrect password
- 404 Not Found — captain not found
- 500 Internal Server Error — token generation or server error

### Example cURL

```bash
curl -X POST http://localhost:8000/api/v1/captains/login \
  -H "Content-Type: application/json" \
  -d '{"username":"janecaptain","password":"StrongPassword123"}'
```

## Captains API — Profile Endpoint

### Endpoint

- URL: `/api/v1/captains/profile`
- Method: `GET`
- Auth: Required (accessToken)

### Description

Fetch the authenticated captain's profile. Response excludes `password` and `refreshToken`.

### Request Headers

- `Authorization: Bearer <accessToken>` (or send cookie `accessToken`)

### Responses

- 200 OK
  - Body (example):
  ```json
  {
    "status": 200,
    "data": {
      "_id": "60f...abc",
      "fullName": "Jane Captain",
      "email": "jane.captain@example.com",
      "username": "janecaptain",
      "vehicle": {
        "plate": "ABC-1234",
        "model": "Toyota Prius",
        "color": "White"
      },
      "createdAt": "2026-01-31T...",
      "updatedAt": "2026-01-31T..."
    },
    "message": "Captain profile fetched successfully"
  }
  ```
- 401 Unauthorized — missing/invalid access token
- 404 Not Found — captain not found
- 500 Internal Server Error — server error

### Example cURL

```bash
curl -X GET http://localhost:8000/api/v1/captains/profile \
  -H "Authorization: Bearer <accessToken>"
```

## Captains API — Logout Endpoint

### Endpoint

- URL: `/api/v1/captains/logout`
- Method: `POST`
- Auth: Required (accessToken)

### Description

Logs out the authenticated captain by clearing `accessToken` and `refreshToken` cookies and removing the stored refresh token from the database.

### Request Headers

- `Authorization: Bearer <accessToken>` (or send cookie `accessToken`)

### Responses

- 200 OK
  - Body (example):
  ```json
  {
    "status": 200,
    "data": {},
    "message": "Logout successful"
  }
  ```
- 401 Unauthorized — missing/invalid access token
- 404 Not Found — captain not found
- 500 Internal Server Error — server error

### Example cURL

```bash
curl -X POST http://localhost:8000/api/v1/captains/logout \
  -H "Authorization: Bearer <accessToken>"
```

## Captains API — Refresh Access Token Endpoint

### Endpoint

- URL: `/api/v1/captains/refresh-token`
- Method: `POST`
- Auth: None (uses refresh token)

### Description

Accepts a refresh token (from cookie `refreshToken` or request body) and issues new `accessToken` and `refreshToken`. New tokens are saved and sent back in cookies (`httpOnly`, `secure`) and in the response body.

### Request Headers

- `Content-Type: application/json` (if sending token in body)
- or send cookie: `refreshToken=<token>`

### Request Body (optional)

- `refreshToken` (string) — optional if token is sent in cookie

Example:

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Responses

- 200 OK
  - Body (example):
  ```json
  {
    "status": 200,
    "data": {
      "accessToken": "newAccessToken...",
      "refreshToken": "newRefreshToken..."
    },
    "message": "Access token refreshed successfully"
  }
  ```

  - Cookies set: `accessToken`, `refreshToken` (httpOnly, secure)
- 401 Unauthorized — missing refresh token or invalid/expired token
- 404 Not Found — captain associated with token not found
- 500 Internal Server Error — server error / token generation failed

### Example cURL (using cookie)

```bash
curl -X POST http://localhost:8000/api/v1/captains/refresh-token \
  --cookie "refreshToken=<refreshToken>"
```

### Example cURL (using JSON body)

```bash
curl -X POST http://localhost:8000/api/v1/captains/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```
