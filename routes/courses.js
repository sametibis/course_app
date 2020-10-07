const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const Course = require('../models/Course');
const advencedResults = require('../middleware/advencedResults');

router.get(
  '/',
  advencedResults(Course, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getCourses
);

router.get('/:id', getCourse);

router.post('/', protect, authorize('publisher', 'admin'), createCourse);

router.put('/:id', protect, authorize('publisher', 'admin'), updateCourse);

router.delete('/:id', protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
