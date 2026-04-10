const express = require('express');
const { getCourses, getCourseById, enrollCourse } = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getCourses);
router.get('/:id', authMiddleware, getCourseById);
router.post('/enroll/:id', authMiddleware, enrollCourse);
module.exports = router;
