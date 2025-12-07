const Project = require('../models/Project');

// @desc    Get all projects (public or university specific)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const projects = await Project.find({ ...keyword }).populate('owner', 'name avatar');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('collaborators', 'name avatar');

        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { title, summary, description, university, visibility, tags, techStack } = req.body;

        const project = new Project({
            owner: req.user._id,
            title,
            summary,
            description,
            university,
            visibility,
            tags,
            techStack,
            collaborators: []
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const { title, summary, description, visibility, tags, techStack } = req.body;

        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this project' });
            }

            project.title = title || project.title;
            project.summary = summary || project.summary;
            project.description = description || project.description;
            project.visibility = visibility || project.visibility;
            project.tags = tags || project.tags;
            project.techStack = techStack || project.techStack;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this project' });
            }

            // await project.remove(); // Mongoose V8 deprecated remove()
            await Project.deleteOne({ _id: req.params.id });

            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export Project as PDF
// @route   GET /api/projects/:id/pdf
// @access  Public
const exportProjectPDF = async (req, res) => {
    const puppeteer = require('puppeteer');
    try {
        const project = await Project.findById(req.params.id).populate('owner');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${project.title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        .meta { color: #666; margin-bottom: 20px; }
                        .section { margin-bottom: 15px; }
                    </style>
                </head>
                <body>
                    <h1>${project.title}</h1>
                    <div class="meta">
                        <p><strong>University:</strong> ${project.university}</p>
                        <p><strong>Owner:</strong> ${project.owner.name}</p>
                    </div>
                    <div class="section">
                        <h3>Summary</h3>
                        <p>${project.summary}</p>
                    </div>
                    <div class="section">
                        <h3>Description</h3>
                        <p>${project.description}</p>
                    </div>
                    <div class="section">
                        <h3>Tech Stack</h3>
                        <p>${project.techStack.join(', ')}</p>
                    </div>
                </body>
            </html>
        `;

        await page.setContent(content);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Invite Collaborator
// @route   POST /api/projects/:id/invite
// @access  Private
const inviteCollaborator = async (req, res) => {
    const jwt = require('jsonwebtoken');
    try {
        const { email } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to invite to this project' });
        }

        // Generate Invite Token
        const inviteToken = jwt.sign({ projectId: project._id, email }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        // Stub Email Sending
        console.log(`[STUB] Sending Email to ${email} with Invite Link: http://localhost:3000/accept-invite/${inviteToken}`);

        res.json({ message: `Invite sent to ${email}`, token: inviteToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    exportProjectPDF,
    inviteCollaborator
};
