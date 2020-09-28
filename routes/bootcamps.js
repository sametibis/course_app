const express = require('express');
const router = express.Router();

// Bring methods in the Controller
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');

const courseRouter = require('./courses');
// Bootcamps içindeki kursları görüntülemek için kurs routera yönlendirdik. (Kurs router da { mergeParams: true } ile bunu yakalamamız gerek.)
router.use('/:bootcampId/courses', courseRouter);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router.get('/', getBootcamps); // router.route('/').get(getBootcamps)

router.get('/:id', getBootcamp);

router.post('/', createBootcamp);

router.put('/:id', updateBootcamp);

router.delete('/:id', deleteBootcamp);

module.exports = router;
