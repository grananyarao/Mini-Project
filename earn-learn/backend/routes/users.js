const express = require('express');
const { getAllStudents, getUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/students', authMiddleware, roleMiddleware('admin'), getAllStudents);
router.get('/:id', authMiddleware, getUserById);
module.exports = router;
