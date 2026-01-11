// Import all models to ensure they are registered with Mongoose
// This file should be imported before any service that uses populate()

export { Category } from './Category';
export { Author } from './Author';
export { Article } from './Article';
export { Comment } from './Comment';
