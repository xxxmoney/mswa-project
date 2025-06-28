# Notification System Documentation

## Overview

The notification system automatically tracks and creates notifications for all record creation, updates, and archivation operations in the Reference Data API. This provides a comprehensive audit trail and real-time awareness of data changes.

## Features

- **Automatic Tracking**: Notifications are automatically created when records are created, updated, or archived
- **Entity-Specific**: Notifications are linked to specific entities (Country, Currency)
- **Rich Details**: Each notification includes relevant details about the operation
- **Read Status**: Notifications can be marked as read/unread
- **Filtering & Pagination**: Advanced querying capabilities with filters and pagination
- **Real-time Messages**: Human-readable messages for each operation type

## Notification Types

### CREATE
- Triggered when a new record is created
- Message: "New [Entity] '[Identifier]' has been created"

### UPDATE
- Triggered when an existing record is updated
- Message: "[Entity] '[Identifier]' has been updated"
- Includes details about what was changed

### ARCHIVE
- Triggered when a record is archived
- Message: "[Entity] '[Identifier]' has been archived"

## API Endpoints

### Get All Notifications
```
GET /api/notifications
```

**Query Parameters:**
- `pageIndex` (number, default: 0): Page number for pagination
- `pageSize` (number, default: 50): Number of items per page
- `type` (string, optional): Filter by notification type (CREATE, UPDATE, ARCHIVE)
- `entityType` (string, optional): Filter by entity type (Country, Currency)
- `isRead` (boolean, optional): Filter by read status

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [...],
    "pagination": {
      "pageIndex": 0,
      "pageSize": 50,
      "totalCount": 100,
      "totalPages": 2
    },
    "unreadCount": 25
  }
}
```

### Get Notification by ID
```
GET /api/notifications/:id
```

### Get Notifications by Entity
```
GET /api/notifications/entity/:entityType/:entityIdentifier
```

**Parameters:**
- `entityType`: Country or Currency
- `entityIdentifier`: The identifier (e.g., ISO code)

### Get Unread Count
```
GET /api/notifications/unread-count
```

**Query Parameters:**
- `type` (string, optional): Filter by notification type
- `entityType` (string, optional): Filter by entity type

### Mark Notifications as Read
```
PUT /api/notifications/mark-read
```

**Request Body:**
```json
{
  "notificationIds": ["uuid1", "uuid2", "uuid3"]
}
```

### Mark All Notifications as Read
```
PUT /api/notifications/mark-all-read
```

**Request Body:**
```json
{
  "type": "CREATE",
  "entityType": "Country"
}
```

### Delete Notification
```
DELETE /api/notifications/:id
```

## Notification Schema

```javascript
{
  id: String (UUID),
  type: String (CREATE | UPDATE | ARCHIVE),
  entityType: String (Country | Currency),
  entityId: String (UUID of the entity),
  entityIdentifier: String (ISO code or identifier),
  message: String (Human-readable message),
  details: Object (Additional details about the operation),
  isRead: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Example Notifications

### Country Creation
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "CREATE",
  "entityType": "Country",
  "entityId": "550e8400-e29b-41d4-a716-446655440001",
  "entityIdentifier": "US",
  "message": "New country \"US\" has been created",
  "details": {
    "countryName": "United States",
    "currencyIsoCode": "USD",
    "validFrom": "2024-01-01T00:00:00.000Z",
    "validTo": null,
    "action": "created",
    "timestamp": "2024-01-01T10:30:00.000Z"
  },
  "isRead": false,
  "createdAt": "2024-01-01T10:30:00.000Z"
}
```

### Currency Update
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "type": "UPDATE",
  "entityType": "Currency",
  "entityId": "550e8400-e29b-41d4-a716-446655440003",
  "entityIdentifier": "EUR",
  "message": "Currency \"EUR\" has been updated",
  "details": {
    "currencyName": "Euro",
    "symbol": "€",
    "validFrom": "2024-01-01T00:00:00.000Z",
    "validTo": null,
    "changes": {
      "symbol": "€"
    },
    "action": "updated",
    "timestamp": "2024-01-01T11:00:00.000Z"
  },
  "isRead": false,
  "createdAt": "2024-01-01T11:00:00.000Z"
}
```

## Integration

The notification system is automatically integrated into the existing controllers:

- **Country Controller**: Notifications are created for country creation, updates, and archivation
- **Currency Controller**: Notifications are created for currency creation, updates, and archivation

### Automatic Triggers

1. **Create Operations**: When `POST /api/countries` or `POST /api/currencies` is called
2. **Update Operations**: When `PUT /api/countries/:isoCode` or `PUT /api/currencies/:isoCode` is called
3. **Archive Operations**: When `DELETE /api/countries/:isoCode` or `DELETE /api/currencies/:isoCode` is called