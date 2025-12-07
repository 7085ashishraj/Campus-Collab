const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const connectDB = require('../config/db');

dotenv.config();
// Connect to DB (using the logic in db.js, might need adjustment for script context or just copy)
// Using connectDB from config is better but process.env might need to be set or loaded relative.
// We'll trust dotenv.config() works if run from server dir.

const seedData = async () => {
    await connectDB();

    try {
        await User.deleteMany();
        await Project.deleteMany();

        const users = [
            {
                name: 'Alice Johnson',
                email: 'alice@uni1.edu',
                password: 'password123',
                university: 'University One',
                bio: 'CS Student',
                skills: ['React', 'Node.js']
            },
            {
                name: 'Bob Smith',
                email: 'bob@uni1.edu',
                password: 'password123',
                university: 'University One',
                bio: 'Designer',
                skills: ['Figma', 'CSS']
            },
            {
                name: 'Charlie Brown',
                email: 'charlie@uni2.edu',
                password: 'password123',
                university: 'University Two',
                bio: 'Data Scientist',
                skills: ['Python', 'SQL']
            },
            {
                name: 'Diana Prince',
                email: 'diana@uni2.edu',
                password: 'password123',
                university: 'University Two',
                bio: 'Engineer',
                skills: ['Java', 'Spring']
            },
            {
                name: 'Evan Wright',
                email: 'evan@uni3.edu',
                password: 'password123',
                university: 'University Three',
                bio: 'Mobile dev',
                skills: ['Flutter']
            },
            {
                name: 'Fiona Gallagher',
                email: 'fiona@uni3.edu',
                password: 'password123',
                university: 'University Three',
                bio: 'Full Stack',
                skills: ['MERN']
            }
        ];

        // We rely on pre-save hook for password hashing
        const createdUsers = await User.create(users);

        console.log('Users Seeded!');

        // Create a sample project
        const project = new Project({
            title: 'CampusCollab Alpha',
            summary: 'The first version of our collaboration hub.',
            description: '# CampusCollab\nThis is a seeded project.',
            owner: createdUsers[0]._id,
            university: 'University One',
            tags: ['React', 'Node'],
            techStack: ['MERN'],
            visibility: 'public'
        });

        await project.save();
        console.log('Sample Project Seeded!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
