# Log Dashboard
# Logging Service

A lightweight Node.js logging service with MongoDB support. Logs are collected and stored in batches for efficient write operations.

## Features

* Log ingestion via REST API (`POST /logs`)
* Batched logging to MongoDB with customizable flush intervals and bucket sizes
* Simple configuration via environment variables
* Basic validation and error handling

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/logging-service.git
cd logging-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3070
DATABASE_TYPE=1                   # Only 1 (MONGODB) is currently supported
MONGODB_URI=mongodb://localhost:27017
DB_NAME=logging
COLLECTION_NAME=logs
BUCKET_SIZE=10
FLUSH_INTERVAL=5000               # in milliseconds
```

---

## Project Structure

```bash
.
├── Config/
│   ├── config.ts
│   └── enums/
│       ├── DatabaseType.ts
│       └── LogLevel.ts
├── controllers/
│   └── logController.ts
├── interfaces/
│   └── index.ts
├── routes/
│   └── logRoutes.ts
├── services/
│   └── loggerService.ts
├── utils/
│   ├── errors.ts
│   └── logger.ts
├── index.ts
└── README.md
```

---

## API

### POST `/logs`

Create a new log entry.

#### Request Body

```json
{
  "application": "my-app",
  "timestamp": "2025-06-20T15:30:00Z",
  "message": "Something happened",
  "log": {
    "level": "info",
    "file": "app.js"
  },
  "userId": "12345"  // Additional metadata is allowed
}
```

#### Responses

* `201 Created` — Log successfully created.
* `400 Bad Request` — Required fields missing.
* `500 Internal Server Error` — Error while logging.

---

## Supported Log Levels

```ts
export enum LogLevel {
    TRACE = 'trace',
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal'
}
```

---

## Log Storage

Logs are temporarily stored in an in-memory bucket and flushed to MongoDB when either:

* The bucket size reaches `BUCKET_SIZE`
* `FLUSH_INTERVAL` milliseconds have passed

---

## Running the App

```bash
npm run build    # If using TypeScript
npm start
```

Or directly with ts-node:

```bash
npx ts-node index.ts
```

