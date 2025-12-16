const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('author', 'name avatar university')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('author', 'name avatar university')
            .populate('answers.author', 'name avatar university');

        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        const question = new Question({
            title,
            description,
            tags,
            author: req.user._id
        });

        const createdQuestion = await question.save();
        await createdQuestion.populate('author', 'name avatar university');

        res.status(201).json(createdQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add answer to a question
// @route   POST /api/questions/:id/answers
// @access  Private
const addAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const question = await Question.findById(req.params.id);

        if (question) {
            const answer = {
                content,
                author: req.user._id
            };

            question.answers.push(answer);
            await question.save();

            // Re-fetch to populate the new answer's author
            const updatedQuestion = await Question.findById(req.params.id)
                .populate('answers.author', 'name avatar university');

            const newAnswer = updatedQuestion.answers[updatedQuestion.answers.length - 1];

            res.status(201).json(newAnswer);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    addAnswer
};
