const express = require('express');
const { createTask, getTasks, getTaskById, editTask, deleteTask, repostTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', authMiddleware, role('admin'), createTask);
router.get('/', authMiddleware, getTasks); // student/admin
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, role('admin'), editTask);
router.delete('/:id', authMiddleware, role('admin'), deleteTask);
router.post('/:id/repost', authMiddleware, role('admin'), repostTask);
module.exports = router;
