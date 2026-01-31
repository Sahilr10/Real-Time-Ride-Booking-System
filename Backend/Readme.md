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