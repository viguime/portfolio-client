# API Server Instructions

## Running the Mock API Server

The portfolio needs an API backend for the availability/booking feature. A simple Express server is included.

### Quick Start

1. Make sure you've installed dependencies:
```bash
npm install
```

2. Start the API server:
```bash
node server.js
```

The server will run on `http://localhost:3000`.

### Endpoints

#### GET /api/availability
Returns available time slots.

**Response:**
```json
[
  {
    "id": "1",
    "datetime": "2026-01-25T20:00:00.000Z",
    "available": true
  }
]
```

#### POST /api/book
Books a meeting slot.

**Request:**
```json
{
  "slotId": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to discuss a project"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meeting booked successfully"
}
```

## Production API

For production, replace the API URLs in `src/components/AvailabilityDrawer.tsx` with your real API endpoints.

You might want to integrate with:
- **Calendly API** - For calendar scheduling
- **Google Calendar API** - For availability checking
- **Your own backend** - Custom booking logic

## Development with Different Port

If port 3000 is in use, change the port in `server.js`:

```javascript
const PORT = 4000; // or any available port
```

Then update the URLs in `src/components/AvailabilityDrawer.tsx` to match.
