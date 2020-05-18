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
  getErrorPage
} = require('../controller/viewsController');
const { isLoggedIn, protect } = require('../controller/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getHomePage);
router.get('/gymadmin', protect, getGymAdminDashboard);
router.get('/login', getLogin);
router.get('/signup', getSignUp);
router.get('/verification', getSignupVerification);
router.get('/accountNotActivated', getNotActive);
router.get('/accountActive', getAccountActive);
router.get('/forgotPassword', getForgotPassword);
router.get('/resetPassword', getResetPassword);
router.get('/error', getErrorPage);

module.exports = router;
