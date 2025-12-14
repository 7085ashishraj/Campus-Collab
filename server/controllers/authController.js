const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, university, bio, skills } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            university,
            bio,
            skills
        });

        if (user) {
            const accessToken = generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                university: user.university,
                accessToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                university: user.university,
                accessToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.university = req.body.university || user.university;
            user.bio = req.body.bio || user.bio;
            user.skills = req.body.skills || user.skills;
            user.githubId = req.body.githubId || user.githubId;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            const generateToken = require('../utils/generateToken');
            // We don't necessarily need to generate a new token if we aren't changing auth criticals, but good practice if roles changed etc.
            // For now just return user info.

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                university: updatedUser.university,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                githubId: updatedUser.githubId,
                avatar: updatedUser.avatar,
                // token: generateToken(res, updatedUser._id), 
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile
};
