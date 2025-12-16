const express = require('express');
const router = express.Router();
const {
    getQuestions,
    getQuestionById,
    createQuestion,
    addAnswer
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getQuestions)
    .post(protect, createQuestion);

router.route('/:id')
    .get(getQuestionById);

router.route('/:id/answers')
    .post(protect, addAnswer);

module.exports = router;
