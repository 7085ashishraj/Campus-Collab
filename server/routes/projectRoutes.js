const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    exportProjectPDF,
    inviteCollaborator
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(protect, createProject);

router.get('/:id/pdf', exportProjectPDF);
router.post('/:id/invite', protect, inviteCollaborator);

router.route('/:id')
    .get(getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;
