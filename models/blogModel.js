import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  featuredImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  seo: {
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

blogSchema.index({ title: 'text', content: 'text' });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
