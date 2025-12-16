const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleById,
    createArticle,
    likeArticle
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getArticles)
    .post(protect, createArticle);

router.route('/:id')
    .get(getArticleById);

router.route('/:id/like')
    .put(protect, likeArticle);

module.exports = router;
