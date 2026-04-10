const express = require('express');
const { submitTask, getSubmissionList, evaluateSubmission } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Use multer upload as middleware for files on this route
router.post('/', authMiddleware, role('student'), upload.array('attachments', 5), submitTask);
router.get('/task/:taskId', authMiddleware, getSubmissionList);
router.post('/evaluate/:id', authMiddleware, role('admin'), evaluateSubmission);

module.exports = router;
