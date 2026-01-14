# Blog Public API

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

A read-only REST API for serving blog content to public frontends, built with Express.js, TypeScript, and MongoDB.

## Features

- **Read-Only API**
  - Articles listing with pagination and filtering
  - Categories and tags
  - Authors
  - Static pages with groups
  - Navigation menus
  - Site settings

- **Performance & Security**
  - Rate limiting
  - Helmet security headers
  - CORS configuration
  - Gzip compression

- **Documentation**
  - Swagger/OpenAPI documentation
  - Auto-generated from JSDoc comments

- **Data Validation**
  - Zod schema validation
  - Type-safe request handling

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Language**: TypeScript 5
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, express-rate-limit, CORS

## Prerequisites

- Node.js >= 20.0.0
- MongoDB 6+ (local or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/avivmaman/blog-public-api.git
cd blog-public-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blog
FRONTEND_URL=http://localhost:3000
```

### 4. Start the server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3001`.

API documentation is available at `http://localhost:3001/api-docs`.

## Docker

### Build and run with Docker

```bash
docker build -t blog-public-api .
docker run -p 3001:3001 --env-file .env blog-public-api
```

### Using Docker Compose

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | - |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## API Endpoints

### Articles
- `GET /api/articles` - List published articles
- `GET /api/articles/:slug` - Get article by slug
- `GET /api/articles/featured` - Get featured articles

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:slug` - Get category with articles

### Tags
- `GET /api/tags` - List tags
- `GET /api/tags/:slug` - Get tag with articles

### Authors
- `GET /api/authors` - List authors
- `GET /api/authors/:slug` - Get author with articles

### Pages
- `GET /api/pages` - List published pages
- `GET /api/pages/:slug` - Get page by slug
- `GET /api/pages/groups` - Get page groups

### Navigation
- `GET /api/navigation` - Get navigation menus
- `GET /api/navigation/:location` - Get menu by location

### Settings
- `GET /api/settings` - Get site settings

### Health
- `GET /health` - Health check endpoint

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

## Project Structure

```
blog-public-api/
├── src/
│   ├── config/         # Configuration
│   │   ├── database.ts # MongoDB connection
│   │   ├── env.ts      # Environment validation
│   │   └── swagger.ts  # Swagger config
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── security.ts
│   │   └── validation.ts
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utilities
│   ├── app.ts          # Express app
│   └── server.ts       # Entry point
├── .env.example        # Environment template
├── Dockerfile          # Docker config
├── docker-compose.yml  # Docker Compose
└── package.json
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

This project is part of the **Blog Platform** ecosystem:

| Project | Description |
|---------|-------------|
| [blog-admin-api](https://github.com/avivmaman/blog-admin-api) | Admin backend API |
| [blog-admin-ui](https://github.com/avivmaman/blog-admin-ui) | Admin dashboard frontend |
| [blog-public-api](https://github.com/avivmaman/blog-public-api) | Public-facing read-only API (this repo) |
