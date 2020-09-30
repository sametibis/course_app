const express = require('express');
const router = express.Router({ mergeParams: true });

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

router.post('/', createCourse);

router.put('/:id', updateCourse);

router.delete('/:id', deleteCourse);

module.exports = router;
