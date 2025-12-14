const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const documentUpload = require('../middleware/documentUpload');

router.route('/')
    .get(getProjects)
    .post(protect, createProject);

router.get('/:id/pdf', exportProjectPDF);
router.post('/:id/invite', protect, inviteCollaborator);

// Collaboration Routes
router.post('/:id/collaboration-request', protect, requestCollaboration);
router.get('/:id/collaboration-requests', protect, getCollaborationRequests);
router.put('/:id/collaboration-request/:requestId', protect, respondToCollaborationRequest);

// File Upload Route
router.post('/:id/files', protect, documentUpload.single('file'), uploadFile);

router.route('/:id')
    .get(getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;
