import express from 'express';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getPublishedBlogs,
  getBlogBySlug,
} from '../controller/blogController.js';
import { adminProtect } from '../middleware/authMiddleware.js';

const blogRouter = express.Router();

blogRouter.get('/published', getPublishedBlogs);
blogRouter.get('/slug/:slug', getBlogBySlug);

blogRouter.use(adminProtect);

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getBlog);
blogRouter.post('/', createBlog);
blogRouter.put('/:id', updateBlog);
blogRouter.delete('/:id', deleteBlog);

export default blogRouter;
