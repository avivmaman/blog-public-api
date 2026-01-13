import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Generic Blog API',
      version: '1.0.0',
      description: `
A flexible, read-only blog API that can power any blog frontend.

## Features
- **Articles** - Blog posts with rich content blocks
- **Pages** - Generic content pages with grouping support
- **Categories & Tags** - Flexible taxonomy system
- **Authors** - Content authors with profiles
- **Navigation** - Configurable menus
- **Media** - Asset management
- **Site Settings** - Global configuration

## Content Blocks
Articles and pages use rich JSON content blocks (similar to Notion/Editor.js):
- paragraph, heading, image, code, quote, list, divider, embed, table, callout, raw

## Authentication
This is a public read-only API. No authentication required.
Admin endpoints (POST, PUT, DELETE) will be available in a separate Admin API.
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    tags: [
      { name: 'Articles', description: 'Blog articles/posts' },
      { name: 'Pages', description: 'Generic content pages' },
      { name: 'Page Groups', description: 'Logical page groupings' },
      { name: 'Categories', description: 'Article categories' },
      { name: 'Tags', description: 'Article tags' },
      { name: 'Authors', description: 'Content authors' },
      { name: 'Navigation', description: 'Site navigation menus' },
      { name: 'Media', description: 'Media assets' },
      { name: 'Settings', description: 'Site settings' },
      { name: 'Health', description: 'API health and meta' },
    ],
    components: {
      schemas: {
        // Content Block
        ContentBlock: {
          type: 'object',
          required: ['type', 'data'],
          properties: {
            type: {
              type: 'string',
              enum: ['paragraph', 'heading', 'image', 'code', 'quote', 'list', 'divider', 'embed', 'table', 'callout', 'raw'],
            },
            data: {
              type: 'object',
              description: 'Block-specific data',
            },
          },
        },
        // SEO Fields
        SEOFields: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            noIndex: { type: 'boolean' },
            canonicalUrl: { type: 'string' },
          },
        },
        // Article
        Article: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            title: { type: 'string' },
            excerpt: { type: 'string' },
            content: {
              type: 'array',
              items: { $ref: '#/components/schemas/ContentBlock' },
            },
            contentHtml: { type: 'string' },
            image: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' },
            author: { $ref: '#/components/schemas/Author' },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' },
            },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            readTime: { type: 'string' },
            views: { type: 'integer' },
            isFeatured: { type: 'boolean' },
            seo: { $ref: '#/components/schemas/SEOFields' },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  level: { type: 'integer' },
                },
              },
            },
            publishedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Page
        Page: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: {
              type: 'array',
              items: { $ref: '#/components/schemas/ContentBlock' },
            },
            group: { $ref: '#/components/schemas/PageGroup' },
            status: { type: 'string', enum: ['draft', 'published'] },
            order: { type: 'integer' },
            seo: { $ref: '#/components/schemas/SEOFields' },
            publishedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Page Group
        PageGroup: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            order: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Category
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            color: { type: 'string' },
            order: { type: 'integer' },
            parent: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Tag
        Tag: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            color: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Author
        Author: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' },
            bio: { type: 'string' },
            role: { type: 'string' },
            social: {
              type: 'object',
              properties: {
                twitter: { type: 'string' },
                linkedin: { type: 'string' },
                github: { type: 'string' },
                website: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Media
        Media: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            filename: { type: 'string' },
            originalName: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'integer' },
            url: { type: 'string' },
            alt: { type: 'string' },
            caption: { type: 'string' },
            width: { type: 'integer' },
            height: { type: 'integer' },
            folder: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Navigation
        Navigation: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string' },
            name: { type: 'string' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/NavItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Nav Item
        NavItem: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            label: { type: 'string' },
            url: { type: 'string' },
            page: { type: 'string' },
            target: { type: 'string', enum: ['_self', '_blank'] },
            icon: { type: 'string' },
            order: { type: 'integer' },
            children: {
              type: 'array',
              items: { $ref: '#/components/schemas/NavItem' },
            },
          },
        },
        // Site Setting
        SiteSetting: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: {},
            type: { type: 'string', enum: ['string', 'number', 'boolean', 'json', 'image'] },
            group: { type: 'string' },
            label: { type: 'string' },
            description: { type: 'string' },
          },
        },
        // Comment
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            author: { type: 'string' },
            avatar: { type: 'string' },
            content: { type: 'string' },
            likes: { type: 'integer' },
            replies: {
              type: 'array',
              items: { $ref: '#/components/schemas/Comment' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Pagination Meta
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {},
            meta: { $ref: '#/components/schemas/PaginationMeta' },
          },
        },
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: {},
              },
            },
          },
        },
      },
      parameters: {
        pageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number',
          schema: { type: 'integer', default: 1, minimum: 1 },
        },
        limitParam: {
          name: 'limit',
          in: 'query',
          description: 'Items per page',
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 50 },
        },
        sortParam: {
          name: 'sort',
          in: 'query',
          description: 'Sort order',
          schema: { type: 'string', enum: ['latest', 'popular', 'trending', 'oldest'] },
        },
        slugParam: {
          name: 'slug',
          in: 'path',
          required: true,
          description: 'Unique slug identifier',
          schema: { type: 'string' },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
