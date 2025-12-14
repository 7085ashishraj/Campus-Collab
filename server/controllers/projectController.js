const Project = require('../models/Project');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Chat = require('../models/Chat');

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

        const projects = await Project.find({ ...keyword })
            .populate('owner', 'name avatar')
            .sort({ createdAt: -1 });
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
            .populate('collaborators', 'name email avatar bio skills university');

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

        // Broadcast notification to all other users
        const users = await User.find({ _id: { $ne: req.user._id } }).select('_id');
        if (users.length > 0) {
            const notifications = users.map(u => ({
                recipient: u._id,
                type: 'info',
                message: `New project "${createdProject.title}" posted by ${req.user.name}`,
                relatedId: createdProject._id,
                link: `/projects/${createdProject._id}`
            }));
            await Notification.insertMany(notifications);
        }

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

// @desc    Request Collaboration
// @route   POST /api/projects/:id/collaboration-request
// @access  Private
const requestCollaboration = async (req, res) => {
    try {
        const { message } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You are the owner of this project' });
        }

        if (project.collaborators.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a collaborator' });
        }

        const existingRequest = project.collaborationRequests.find(
            req => req.user.toString() === req.user._id.toString() && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request' });
        }

        project.collaborationRequests.push({
            user: req.user._id,
            message
        });

        await project.save();

        // Create Notification for Project Owner
        await Notification.create({
            recipient: project.owner,
            type: 'info',
            message: `${req.user.name} requested to collaborate on "${project.title}"`,
            relatedId: project._id,
            link: '/dashboard'
        });

        res.status(200).json({ message: 'Collaboration request sent successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Collaboration Requests
// @route   GET /api/projects/:id/collaboration-requests
// @access  Private (Owner only)
const getCollaborationRequests = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('collaborationRequests.user', 'name email avatar');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(project.collaborationRequests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Respond to Collaboration Request
// @route   PUT /api/projects/:id/collaboration-request/:requestId
// @access  Private (Owner only)
const respondToCollaborationRequest = async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const request = project.collaborationRequests.id(req.params.requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;

        if (status === 'accepted') {
            project.collaborators.push(request.user);
        }

        await project.save();

        // Notify the requester
        if (request) {
            await Notification.create({
                recipient: request.user,
                type: status === 'accepted' ? 'success' : 'error',
                message: `Your request to collaborate on "${project.title}" was ${status}`,
                relatedId: project._id,
                link: `/projects/${project._id}`
            });

            // Automatic Group Chat Handling
            if (status === 'accepted') {
                const existingChat = await Chat.findOne({ project: project._id });

                if (existingChat) {
                    // Add user to existing chat if not present
                    if (!existingChat.users.includes(request.user)) {
                        existingChat.users.push(request.user);
                        await existingChat.save();
                    }
                } else {
                    // Create new group chat
                    const chatName = project.title;
                    const chatData = {
                        chatName: chatName,
                        isGroupChat: true,
                        users: [project.owner, request.user],
                        groupAdmin: project.owner,
                        project: project._id,
                    };
                    await Chat.create(chatData);
                }
            }
        }

        res.json({ message: `Request ${status}` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload File to Project
// @route   POST /api/projects/:id/files
// @access  Private (Owner or Collaborator)
const uploadFile = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isOwner = project.owner.toString() === req.user._id.toString();
        const isCollaborator = project.collaborators.includes(req.user._id);

        if (!isOwner && !isCollaborator) {
            return res.status(401).json({ message: 'Not authorized to upload files to this project' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const newFile = {
            name: req.file.originalname,
            path: `/${req.file.path.replace(/\\/g, '/')}`,
            uploader: req.user._id
        };

        project.files.push(newFile);
        await project.save();

        res.status(201).json(newFile);

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
    inviteCollaborator,
    requestCollaboration,
    getCollaborationRequests,
    respondToCollaborationRequest,
    uploadFile
};
