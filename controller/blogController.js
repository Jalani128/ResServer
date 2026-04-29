import Blog from '../models/blogModel.js';

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, slug, content, featuredImage, author, status, tags, seo } = req.body;

    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists',
      });
    }

    const blog = new Blog({
      title,
      slug,
      content,
      featuredImage,
      author,
      status,
      tags,
      seo,
    });

    await blog.save();

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, featuredImage, author, status, tags, seo } = req.body;

    if (slug) {
      const existingBlog = await Blog.findOne({ slug, _id: { $ne: id } });
      if (existingBlog) {
        return res.status(400).json({
          success: false,
          message: 'A blog with this slug already exists',
        });
      }
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, slug, content, featuredImage, author, status, tags, seo },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
    });
  }
};

export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
    });
  }
};

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error('Get published blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch published blogs',
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
    });
  }
};