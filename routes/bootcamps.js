const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Bring methods in the Controller
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advencedResults = require('../middleware/advencedResults');

const courseRouter = require('./courses');
// Bootcamps içindeki kursları görüntülemek için kurs routera yönlendirdik. (Kurs router da { mergeParams: true } ile bunu yakalamamız gerek.)
router.use('/:bootcampId/courses', courseRouter);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router.get('/', advencedResults(Bootcamp, 'courses'), getBootcamps);

router.get('/:id', getBootcamp);

router.post('/', protect, authorize('publisher', 'admin'), createBootcamp);

router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamp);

router.delete('/:id', protect, authorize('publisher', 'admin'),  deleteBootcamp);

router.put('/:id/photo', protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
