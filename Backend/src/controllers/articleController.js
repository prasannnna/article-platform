const Article = require('../models/Article');
const User = require('../models/User');
const { uploadImage, deleteImage } = require('../config/cloudinary');


const getArticles = async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 9 } = req.query;

    // Build filter object
    let filter = {};
    if (category && category !== 'all' && category !== 'undefined') {
      filter.category = category;
    }

    // Build sort object
    let sortOption = {};
    if (sort === 'latest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { votes: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get articles
    const articles = await Article.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Article.countDocuments(filter);

    res.status(200).json({
      success: true,
      articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalArticles: total,
        hasMore: skip + articles.length < total,
      },
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      message: "Error finding articles",
      error: error.message
    });
  }
};


const createArticle = async (req, res) => {
  try {
    const { title, description, content, category } = req.body;

    // Validate required fields
    if (!title || !description || !content) {
      return res.status(400).json({
        message: "Please provide title, description, and content"
      });
    }

    // Get user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer, 'article-platform');
        imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    // Create article
    const article = new Article({
      title: title.trim(),
      description: description.trim(),
      overview: content.trim(), // Map 'content' from frontend to 'overview' in database
      category: category || 'other',
      imageUrl: imageUrl,
      author: user._id,
      authorName: user.name,
    });

    await article.save();

    // Update user's article count
    user.totalArticles += 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Article published successfully",
      article,
    });
  } catch (error) {
    console.error('Create article error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({
      message: "Error creating article",
      error: error.message
    });
  }
};


const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    // Increment views
    await article.incrementViews();

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Get article error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    res.status(500).json({
      message: "Error finding article",
      error: error.message
    });
  }
};


const updateArticle = async (req, res) => {
  try {
    const { title, description, content, category } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    // Check ownership
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Only creators can update"
      });
    }

    // Handle image upload
    let imageUrl = article.imageUrl;
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer, 'article-platform');
        imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    // Update fields
    if (title) article.title = title.trim();
    if (description) article.description = description.trim();
    if (content) article.overview = content.trim();
    if (category) article.category = category;
    article.imageUrl = imageUrl;

    await article.save();

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      article,
    });
  } catch (error) {
    console.error('Update article error:', error);

    res.status(500).json({
      message: 'Server error while updating article',
      error: error.message
    });
  }
};


const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }
    
    // Check ownership
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Only creators can delete"
      });
    }
    
    await article.deleteOne();

    // Update user's article count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { totalArticles: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      message: "Error deleting article",
      error: error.message
    });
  }
};


const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error('Get my articles error:', error);
    res.status(500).json({
      message: 'Error fetching your articles',
      error: error.message
    });
  }
};


const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const articles = await Article.find()
      .sort({ votes: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      leaderboard: articles,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  getLeaderboard,
};