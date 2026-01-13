# Generic Blog API Design

## Overview
A flexible, read-only blog API that can power any blog frontend. All content is managed via a separate Admin API.

---

## Core Entities

### 1. Pages
Generic content pages with flexible block-based content.

```typescript
{
  _id: ObjectId,
  slug: string,           // Unique identifier: "privacy-policy"
  title: string,          // "Privacy Policy"
  description?: string,   // SEO description
  content: ContentBlock[], // Rich JSON blocks
  group?: string,         // "footer", "legal", "about"
  status: "draft" | "published",
  order: number,          // Sort order within group
  seo: {
    title?: string,
    description?: string,
    image?: string,
    noIndex?: boolean
  },
  createdAt: Date,
  updatedAt: Date,
  publishedAt?: Date
}
```

### 2. Page Groups
Logical groupings of pages.

```typescript
{
  _id: ObjectId,
  slug: string,           // "footer", "legal"
  name: string,           // "Footer Pages"
  description?: string,
  order: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Articles (Posts)
Blog posts/articles - extends Page concept.

```typescript
{
  _id: ObjectId,
  slug: string,
  title: string,
  excerpt: string,
  content: ContentBlock[],
  featuredImage?: ObjectId, // Reference to Media
  category: ObjectId,
  author: ObjectId,
  tags: ObjectId[],
  status: "draft" | "published" | "archived",
  readTime: string,
  views: number,
  seo: SEOFields,
  createdAt: Date,
  updatedAt: Date,
  publishedAt?: Date
}
```

### 4. Categories
Article categories.

```typescript
{
  _id: ObjectId,
  slug: string,
  name: string,
  description: string,
  icon?: string,
  color?: string,
  order: number,
  parent?: ObjectId,      // For nested categories
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Tags
Flexible tagging system.

```typescript
{
  _id: ObjectId,
  slug: string,
  name: string,
  description?: string,
  color?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Authors
Content authors.

```typescript
{
  _id: ObjectId,
  slug: string,
  name: string,
  email?: string,
  avatar?: ObjectId,      // Reference to Media
  bio?: string,
  role: string,
  social?: {
    twitter?: string,
    linkedin?: string,
    github?: string,
    website?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Media (Assets)
Images, files, and other assets.

```typescript
{
  _id: ObjectId,
  filename: string,
  originalName: string,
  mimeType: string,
  size: number,           // In bytes
  url: string,            // CDN or storage URL
  alt?: string,
  caption?: string,
  width?: number,         // For images
  height?: number,
  folder?: string,        // Organization
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Navigation (Menus)
Configurable navigation menus.

```typescript
{
  _id: ObjectId,
  slug: string,           // "header", "footer", "sidebar"
  name: string,
  items: NavItem[],
  createdAt: Date,
  updatedAt: Date
}

// NavItem
{
  _id: ObjectId,
  label: string,
  url?: string,           // External URL
  page?: ObjectId,        // Internal page reference
  target?: "_self" | "_blank",
  icon?: string,
  order: number,
  children?: NavItem[]    // Nested items
}
```

### 9. Site Settings
Global site configuration.

```typescript
{
  _id: ObjectId,
  key: string,            // Unique setting key
  value: any,             // Flexible value
  type: "string" | "number" | "boolean" | "json" | "image",
  group: string,          // "general", "seo", "social", "appearance"
  label: string,          // Human-readable label
  description?: string,
  updatedAt: Date
}

// Common settings:
// - site_name, site_description, site_logo
// - seo_title_template, seo_default_image
// - social_twitter, social_facebook, social_instagram
// - analytics_id, contact_email
```

### 10. Comments (Optional)
Article comments.

```typescript
{
  _id: ObjectId,
  article: ObjectId,
  author: string,         // Guest name
  email?: string,
  avatar?: string,
  content: string,
  status: "pending" | "approved" | "spam",
  likes: number,
  parent?: ObjectId,      // For replies
  createdAt: Date,
  updatedAt: Date
}
```

---

## Content Blocks Schema

Rich JSON block-based content (like Notion/Editor.js):

```typescript
type ContentBlock =
  | { type: "paragraph", data: { text: string } }
  | { type: "heading", data: { text: string, level: 1 | 2 | 3 | 4 | 5 | 6 } }
  | { type: "image", data: { url: string, alt?: string, caption?: string } }
  | { type: "code", data: { code: string, language?: string } }
  | { type: "quote", data: { text: string, author?: string } }
  | { type: "list", data: { style: "ordered" | "unordered", items: string[] } }
  | { type: "divider", data: {} }
  | { type: "embed", data: { url: string, provider?: string } }
  | { type: "table", data: { rows: string[][] } }
  | { type: "callout", data: { text: string, type: "info" | "warning" | "error" | "success" } }
  | { type: "raw", data: { html: string } };
```

---

## API Endpoints

### Pages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pages` | List all published pages |
| GET | `/api/pages/:slug` | Get page by slug |
| GET | `/api/pages/group/:group` | Get pages by group |

### Page Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/page-groups` | List all page groups |
| GET | `/api/page-groups/:slug` | Get group with its pages |

### Articles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List articles (paginated) |
| GET | `/api/articles/trending` | Get trending articles |
| GET | `/api/articles/featured` | Get featured articles |
| GET | `/api/articles/search` | Search articles |
| GET | `/api/articles/:slug` | Get article by slug |
| GET | `/api/articles/:slug/related` | Get related articles |
| GET | `/api/articles/:slug/comments` | Get article comments |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:slug` | Get category details |
| GET | `/api/categories/:slug/articles` | Get articles in category |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | List all tags |
| GET | `/api/tags/:slug` | Get tag details |
| GET | `/api/tags/:slug/articles` | Get articles with tag |

### Authors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors` | List all authors |
| GET | `/api/authors/:slug` | Get author details |
| GET | `/api/authors/:slug/articles` | Get author's articles |

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/media` | List media (paginated) |
| GET | `/api/media/:id` | Get media by ID |

### Navigation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/navigation` | List all menus |
| GET | `/api/navigation/:slug` | Get menu by slug |

### Site Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all public settings |
| GET | `/api/settings/:key` | Get setting by key |
| GET | `/api/settings/group/:group` | Get settings by group |

### Health & Meta
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/meta` | API metadata (version, etc.) |

---

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

### Sorting
- `sort` - Sort field (e.g., `latest`, `popular`, `oldest`)
- `order` - Sort order: `asc` or `desc`

### Filtering
- `status` - Filter by status (usually only `published` for public API)
- `category` - Filter by category slug
- `tag` - Filter by tag slug
- `author` - Filter by author slug

### Search
- `q` - Search query string

---

## Response Format

All responses follow a consistent format:

```typescript
// Success response
{
  success: true,
  data: T | T[],
  meta?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

---

## Documentation

Using **Swagger/OpenAPI 3.0** with:
- `swagger-jsdoc` - Generate spec from JSDoc comments
- `swagger-ui-express` - Serve interactive docs at `/api/docs`

Documentation available at: `GET /api/docs`
