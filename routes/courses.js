const express = require('express');
const router = express.Router({ mergeParams: true });

const { getCourses } = require('../controllers/courses');

router.get('/', getCourses);

module.exports = router;
