# Fantasy Kingdoms API

## Overview

This application provides a RESTful API for managing fantasy kingdoms and their regions. It allows you to create, read, update, and delete kingdoms and regions, with regions being associated with kingdoms in a "has a" relationship.

## Features

- Complete CRUD operations for kingdoms and regions
- MongoDB database with Mongoose schemas
- Data validation for all models
- RESTful API with clear endpoints
- Error handling for all routes
- "Has a" relationship between kingdoms and regions

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful JSON API

## Project Structure

```
├── server.js              # Application entry point
├── src/                   # Source code
│   ├── app.js             # Express application setup
│   ├── config/            # Configuration files
│   │   └── index.js       # Main configuration
│   ├── db/                # Database connection
│   │   └── index.js       # MongoDB connection
│   ├── api/               # API related code
│   │   ├── controllers/   # Request handlers
│   │   │   ├── kingdomController.js
│   │   │   └── regionController.js
│   │   ├── routes/        # API routes
│   │   │   ├── index.js   # API router
│   │   │   ├── kingdomRoutes.js
│   │   │   └── regionRoutes.js
│   │   └── models/        # Data models
│   │       ├── index.js   # Models index
│   │       ├── kingdom.js # Kingdom schema
│   │       └── region.js  # Region schema
│   └── public/            # Static assets (if any)
```

## Models

### Kingdom

- **name**: String (required, unique)
- **ruler**: String (required)
- **foundedYear**: Number (required)
- **population**: Number (required)
- **isActive**: Boolean (default: true)
- **description**: String

### Region

- **name**: String (required)
- **kingdom**: ObjectId (reference to Kingdom, required)
- **terrain**: String (required, enum of terrain types)
- **resources**: Array of Strings
- **dangerLevel**: Number (required, 1-10)
- **coordinates**: Object with x and y coordinates (required)

## API Endpoints

### Kingdoms

- `GET /api/kingdoms` - Get all kingdoms
- `GET /api/kingdoms/:id` - Get a specific kingdom by ID
- `POST /api/kingdoms` - Create a new kingdom
- `PUT /api/kingdoms/:id` - Update a kingdom
- `DELETE /api/kingdoms/:id` - Delete a kingdom

### Regions

- `GET /api/regions` - Get all regions
- `GET /api/regions/:id` - Get a specific region by ID
- `GET /api/regions/kingdom/:kingdomId` - Get all regions for a specific kingdom
- `POST /api/regions` - Create a new region
- `PUT /api/regions/:id` - Update a region
- `DELETE /api/regions/:id` - Delete a region

## Data Formats

### Kingdom Data

```javascript
{
  "name": "Eldoria",
  "ruler": "Queen Elara",
  "foundedYear": 1200,
  "population": 50000,
  "isActive": true,
  "description": "A prosperous kingdom with lush forests and fertile plains"
}
```

### Region Data

```javascript
{
  "name": "Misty Mountains",
  "kingdom": "60d21b4667d0d8992e610c85", // Kingdom ObjectId
  "terrain": "Mountains",
  "resources": ["Iron", "Silver", "Crystal"],
  "dangerLevel": 7,
  "coordinates": {
    "x": 120,
    "y": 85
  }
}
```

## Running the Project

To run the application:

```bash
# Install dependencies
npm install

# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Then access the API at http://localhost:3000/api

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with `MONGO_URI` for your MongoDB connection
4. Start the server: `npm run dev`
5. Use API endpoints at `http://localhost:3000/api`

**Note**: This application is an API server. You can interact with it using tools like Postman, curl, or by building a frontend application that consumes these endpoints.
