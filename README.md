# School Management API

A submission-ready Node.js assignment project built with Express.js and MySQL.

This API supports:

- adding a school with validated input
- listing schools sorted by proximity to a user's latitude and longitude
- automatic table creation on startup
- deployment on Render with Railway MySQL

## Live API

Base URL:

`https://school-management-api-ro4a.onrender.com`

Useful endpoints:

- `GET /`
- `GET /health`
- `POST /addSchool`
- `GET /listSchools?latitude=12.9716&longitude=77.5946`

## Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- express-validator
- Render
- Railway

## Project Structure

```text
school-management-api/
|-- postman/
|   |-- School_Management_API.postman_collection.json
|   `-- School_Management_Local.postman_environment.json
|-- src/
|   |-- config/
|   |   `-- database.js
|   |-- controllers/
|   |   `-- schoolController.js
|   |-- middleware/
|   |   `-- validators.js
|   |-- routes/
|   |   `-- schoolRoutes.js
|   |-- utils/
|   |   `-- distance.js
|   `-- index.js
|-- .env.example
|-- package.json
|-- render.yaml
`-- schema.sql
```

## Database Schema

The project uses a `schools` table with these fields:

| Field | Type | Notes |
|---|---|---|
| `id` | INT | Primary key, auto increment |
| `name` | VARCHAR(255) | Required |
| `address` | VARCHAR(500) | Required |
| `latitude` | FLOAT | Required |
| `longitude` | FLOAT | Required |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

The application automatically creates the `schools` table if it does not already exist.

## API Details

### 1. Add School

- Method: `POST`
- Endpoint: `/addSchool`
- Content-Type: `application/json`

Sample request:

```json
{
  "name": "Springfield Elementary School",
  "address": "123 Main Street, Springfield, IL 62701",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```

Sample success response:

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Springfield Elementary School",
    "address": "123 Main Street, Springfield, IL 62701",
    "latitude": 39.7817,
    "longitude": -89.6501,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

Validation rules:

- `name` must be a non-empty string
- `address` must be a non-empty string
- `latitude` must be a number between `-90` and `90`
- `longitude` must be a number between `-180` and `180`

### 2. List Schools

- Method: `GET`
- Endpoint: `/listSchools`
- Query params: `latitude`, `longitude`

Sample request:

```text
GET /listSchools?latitude=12.9716&longitude=77.5946
```

Sample success response:

```json
{
  "success": true,
  "message": "Schools retrieved and sorted by proximity",
  "userLocation": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "total": 2,
  "data": [
    {
      "id": 1,
      "name": "Springfield Elementary School",
      "address": "123 Main Street, Springfield, IL 62701",
      "latitude": 39.7817,
      "longitude": -89.6501,
      "created_at": "2024-01-15T10:30:00.000Z",
      "distance_km": 0
    }
  ]
}
```

Sorting logic:

- all schools are fetched from MySQL
- the distance from the user location is calculated with the Haversine formula
- results are sorted in ascending order by `distance_km`

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MySQL 8+

### Steps

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example`.
4. Add your local MySQL credentials.
5. Start the app:

```bash
npm run dev
```

or

```bash
npm start
```

## Environment Variables

Standard variables:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=school_management
DB_CONNECTION_LIMIT=10
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
```

Railway-compatible variables are also supported:

```env
MYSQLHOST=
MYSQLPORT=
MYSQLUSER=
MYSQLPASSWORD=
MYSQLDATABASE=
MYSQL_URL=
MYSQL_PUBLIC_URL=
DATABASE_URL=
```

## Deployment

This project is deployed using:

- Render for the API
- Railway MySQL for the database

Production URL:

`https://school-management-api-ro4a.onrender.com`

Production environment notes:

- Render provides the app port automatically
- Railway provides the public MySQL endpoint
- SSL is enabled for the Render to Railway DB connection

## Postman

The `postman/` folder includes:

- `School_Management_API.postman_collection.json`
- `School_Management_Local.postman_environment.json`

Import the collection into Postman and set `base_url` to:

`https://school-management-api-ro4a.onrender.com`

Suggested test order:

1. `GET /health`
2. `POST /addSchool`
3. `GET /listSchools`

## Deliverables

For assignment submission:

- Source code repository: GitHub repository URL
- Live API endpoint: `https://school-management-api-ro4a.onrender.com`
- Postman collection: share the exported collection or a Postman public link

## Author

Replace this section with your details before final submission:

- Name: Your Name
- Email: your-email@example.com
- Contact: your-phone-number
