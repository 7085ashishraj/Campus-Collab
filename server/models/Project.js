const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String, // Full markdown description
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    university: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'university'],
        default: 'public'
    },
    tags: [{
        type: String
    }],
    techStack: [{
        type: String
    }],
    image: {
        type: String // Project cover image URL
    },
    collaborationRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    files: [{
        name: String,
        path: String,
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
