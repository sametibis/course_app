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

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

router.get('/', getBootcamps); // router.route('/').get(getBootcamps)

router.get('/:id', getBootcamp);

router.post('/', createBootcamp);

router.put('/:id', updateBootcamp);

router.delete('/:id', deleteBootcamp);



module.exports = router;
