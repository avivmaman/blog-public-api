# Contributing to Blog Public API

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all backgrounds and experience levels.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/blog-public-api.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Copy environment file: `cp .env.example .env`
6. Start development server: `npm run dev`

## Development Workflow

### Running the Project

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use Zod for request validation
- Add Swagger documentation for new endpoints
- Handle errors consistently

### API Design Guidelines

- This is a read-only API - no mutations
- Use proper HTTP methods (GET only)
- Return consistent response formats
- Include pagination for list endpoints
- Document all endpoints in Swagger

### Commit Messages

Use clear, descriptive commit messages:

- `feat: Add new endpoint`
- `fix: Fix query performance`
- `docs: Update API documentation`
- `refactor: Improve code structure`
- `perf: Optimize database queries`
- `chore: Update dependencies`

## Pull Request Process

1. Ensure your code follows the project style
2. Add/update Swagger documentation
3. Test your changes thoroughly
4. Create a pull request with a clear description
5. Link any related issues

### PR Title Format

```
type: Brief description

Examples:
feat: Add search endpoint for articles
fix: Resolve pagination issue
docs: Add API examples
```

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS)
- Relevant logs or error messages
- API request/response examples

## Feature Requests

Feature requests are welcome! Please:

- Check existing issues first
- Provide clear use case description
- Consider API design implications
- Note any performance considerations

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for contributing!
