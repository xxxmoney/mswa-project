# Reference Data API

A RESTful API for managing reference data (countries and currencies) with temporal versioning support, built with Express.js and MongoDB.

## Features

- **Temporal Versioning**: All entities support versioning with validFrom/validTo dates
- **UUID-based Workspace IDs**: Secure, unique identifiers for data isolation
- **CRUD Operations**: Full Create, Read, Update, Delete support
- **Pagination**: Built-in pagination for list operations
- **Validation**: Comprehensive input validation using Joi
- **Error Handling**: Consistent error responses
- **Authentication**: JWT-based authentication system
- **MongoDB Integration**: Mongoose ODM with optimized indexes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/reference-data
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "admin@example.com"
    }
  }
}
```

### Countries

#### POST /api/countries
Create a new country. The workspace UUID is automatically generated.

**Request Body:**
```json
{
  "isoCode": "US",
  "name": "United States",
  "currencyIsoCode": "USD",
  "validFrom": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isoCode": "US",
    "name": "United States",
    "currencyIsoCode": "USD",
    "currencyName": "US Dollar",
    "validFrom": "2024-01-01T00:00:00.000Z",
    "validTo": null,
    "isCurrent": true
  }
}
```

#### GET /api/countries/{id}/{isoCode}
Get current version of a country.

#### PUT /api/countries/{id}/{isoCode}
Update a country (creates new version).

**Request Body:**
```json
{
  "name": "United States of America",
  "currencyIsoCode": "USD",
  "validFrom": "2024-02-01T00:00:00.000Z"
}
```

#### DELETE /api/countries/{id}/{isoCode}
Archive a country.

#### GET /api/countries/{id}
List current countries with pagination.

**Query Parameters:**
- `pageIndex` (optional): Page number (default: 0)
- `pageSize` (optional): Items per page (default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "itemList": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "isoCode": "US",
        "name": "United States",
        "currencyIsoCode": "USD",
        "currencyName": "US Dollar",
        "validFrom": "2024-01-01T00:00:00.000Z",
        "validTo": null
      }
    ],
    "pageInfo": {
      "pageIndex": 0,
      "pageSize": 50
    }
  }
}
```

#### GET /api/countries/{id}/{isoCode}/history
Get version history of a country.

#### GET /api/countries/{id}/currency/{currencyIsoCode}
List countries by currency.

### Currencies

#### POST /api/currencies
Create a new currency. The workspace UUID is automatically generated.

**Request Body:**
```json
{
  "isoCode": "USD",
  "name": "US Dollar",
  "validFrom": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isoCode": "USD",
    "name": "US Dollar",
    "validFrom": "2024-01-01T00:00:00.000Z",
    "validTo": null,
    "isCurrent": true
  }
}
```

#### GET /api/currencies/{id}/{isoCode}
Get current version of a currency.

#### PUT /api/currencies/{id}/{isoCode}
Update a currency (creates new version).

#### DELETE /api/currencies/{id}/{isoCode}
Archive a currency.

#### GET /api/currencies/{id}
List current currencies with pagination.

#### GET /api/currencies/{id}/{isoCode}/history
Get version history of a currency.

## Data Models

### Country
```javascript
{
  id: String (UUID, required, unique),
  isoCode: String (2 chars, required),
  name: String (required),
  currencyIsoCode: String (3 chars, required),
  validFrom: Date (required),
  validTo: Date (null for current version),
  createdAt: Date,
  updatedAt: Date
}
```

### Currency
```javascript
{
  id: String (UUID, required, unique),
  isoCode: String (3 chars, required),
  name: String (required),
  validFrom: Date (required),
  validTo: Date (null for current version),
  createdAt: Date,
  updatedAt: Date
}
```

## Business Rules

1. **Unique ISO Codes**: Each workspace can have only one active country/currency per ISO code
2. **Currency Dependency**: Countries must reference existing active currencies
3. **Temporal Integrity**: New versions must have validFrom dates after the previous version's validFrom
4. **UUID Workspace Isolation**: All data is isolated by workspace UUID
5. **Soft Deletion**: Archiving sets validTo date instead of deleting records
6. **Auto-Generated UUIDs**: Create operations automatically generate workspace UUIDs

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

## Development

### Running Tests
```bash
npm test
```

### Running in Development Mode
```bash
npm run dev
```

### Code Linting
```bash
npm run lint
```

## Security Considerations

- **UUID Workspace IDs**: Prevents enumeration attacks and provides data isolation
- **Input Validation**: All inputs are validated using Joi schemas
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Injection Protection**: Mongoose provides built-in protection
- **Error Sanitization**: Error messages don't expose internal details
- **Auto-Generated IDs**: Create operations generate UUIDs server-side for security

## Performance Optimizations

- **Database Indexes**: Optimized compound indexes for common queries
- **Pagination**: Built-in pagination to handle large datasets
- **Efficient Queries**: Mongoose queries optimized for temporal data
- **Connection Pooling**: MongoDB connection pooling for better performance

## Deployment

1. Set production environment variables
2. Ensure MongoDB is accessible
3. Set up proper logging and monitoring
4. Configure reverse proxy (nginx recommended)
5. Use PM2 or similar process manager

## License

MIT License 
MIT License 