# Image Processing Service

A Node.js-based image processing service that allows users to upload, transform, and manage images with authentication.

## Features

- User Authentication (JWT-based)
- Image Upload
- Image Transformations (resize, crop, rotate, etc.)
- Image Format Conversion
- Image Filters
- PostgreSQL Database
- Docker Support

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
3. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

The service will be available at http://localhost:3000

## API Endpoints

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Images

- POST /api/images - Upload a new image
- GET /api/images - List all images
- GET /api/images/:id - Get specific image
- POST /api/images/:id/transform - Transform an image

## Testing with Postman

### Base URL
```
http://localhost:3000
```

### Step 1: Authentication

1. **Register User**
   - Method: `POST`
   - Endpoint: `/api/auth/register`
   - Body (JSON):
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "yourpassword"
   }
   ```

2. **Login**
   - Method: `POST`
   - Endpoint: `/api/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "yourpassword"
   }
   ```
   - Save the JWT token from the response for subsequent requests

### Step 2: Image Operations

1. **Upload Image**
   - Method: `POST`
   - Endpoint: `/api/images`
   - Headers:
     - `Authorization: Bearer <your-jwt-token>`
   - Body (form-data):
     - Key: `image`
     - Value: Select image file
   - Response will include the image ID needed for transformations
   
2. **Transform Image** (use the ID from the upload response)
   - Method: `POST`
   - Endpoint: `/api/images/{imageId}/transform`
   - Headers:
     - `Authorization: Bearer <your-jwt-token>`
     - `Content-Type: application/json`
   - Body (JSON):
   ```json
   {
     "transformations": {
       "resize": {
         "width": 800,
         "height": 600
       },
       "rotate": 90
     }
   }
   ```

3. **Get User's Images**
   - Method: `GET`
   - Endpoint: `/api/images`
   - Headers:
     - `Authorization: Bearer <your-jwt-token>`

### Testing Workflow Example

1. Register a new user → Save the response
2. Login with the registered user → Save the JWT token
3. Upload an image → Save the returned image ID
4. Use the image ID to perform transformations

### Notes

- Replace `{imageId}` in URLs with actual numeric IDs (e.g., `/api/images/1/transform`)
- Always include the JWT token in the Authorization header
- For image uploads, use form-data instead of JSON
- Image transformations are applied in the order specified

### Admin Endpoints

### Admin Access

#### Default Admin Credentials
```
Email: admin@example.com
Password: admin123
```

#### Creating New Admin Users

1. **Login as Admin**
   - Use the default admin credentials above
   - Method: `POST`
   - Endpoint: `/api/auth/login`
   - Body:
   ```json
   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

2. **Promote User to Admin**
   - Method: `PUT`
   - Endpoint: `/api/admin/users/{userId}/role`
   - Headers:
     - `Authorization: Bearer <admin-jwt-token>`
     - `Content-Type: application/json`
   - Body:
   ```json
   {
     "role": "admin"
   }
   ```

1. **Get All Users**
   - Method: `GET`
   - Endpoint: `/api/admin/users`
   - Headers:
     - `Authorization: Bearer <admin-jwt-token>`

2. **Get User Details**
   - Method: `GET`
   - Endpoint: `/api/admin/users/{userId}`
   - Headers:
     - `Authorization: Bearer <admin-jwt-token>`

3. **Update User Role**
   - Method: `PUT`
   - Endpoint: `/api/admin/users/{userId}/role`
   - Headers:
     - `Authorization: Bearer <admin-jwt-token>`
   - Body:
   ```json
   {
     "role": "admin"  // or "user"
   }
   ```

### Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Rate Limiting

The API implements rate limiting. If you exceed the limit, you'll receive a 429 (Too Many Requests) response.

## Development

To run the service in development mode:

```bash
docker-compose up
```

## License

MIT
