const express = require('express');
const {
  getHomePage,
  getGymAdminDashboard,
  getLogin,
  getSignUp,
  getSignupVerification,
  getNotActive,
  getAccountActive,
  getForgotPassword,
  getResetPassword,
  getProfile
} = require('../controller/viewsController');
const { isLoggedIn, protect } = require('../controller/authController');

const router = express.Router();

router.get('/', isLoggedIn, getHomePage);
router.get('/gymadmin', protect, getGymAdminDashboard);
router.get('/login', isLoggedIn, getLogin);
router.get('/signup', isLoggedIn, getSignUp);
router.get('/verification', isLoggedIn, getSignupVerification);
router.get('/accountNotActivated', isLoggedIn, getNotActive);
router.get('/accountActive', isLoggedIn, getAccountActive);
router.get('/forgotPassword', isLoggedIn, getForgotPassword);
router.get('/resetPassword', isLoggedIn, getResetPassword);
router.get('/profile', protect, getProfile);

module.exports = router;
