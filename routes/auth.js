const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getCurrentUser);

router.put('/update-details', protect, updateDetails);

router.put('/update-password', protect, updatePassword);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
