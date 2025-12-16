const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'name avatar university')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name avatar university');

        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an article
// @route   POST /api/articles
// @access  Private
const createArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        const article = new Article({
            title,
            content,
            tags,
            author: req.user._id
        });

        const createdArticle = await article.save();

        // Populate author info for immediate display
        await createdArticle.populate('author', 'name avatar university');

        res.status(201).json(createdArticle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like an article
// @route   PUT /api/articles/:id/like
// @access  Private
const likeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (article) {
            if (article.likes.includes(req.user._id)) {
                // Unlike because it's already liked
                article.likes = article.likes.filter(id => id.toString() !== req.user._id.toString());
            } else {
                article.likes.push(req.user._id);
            }

            await article.save();
            res.json(article.likes);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    likeArticle
};
