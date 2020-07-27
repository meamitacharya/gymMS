const express = require('express');
const {
  getHomePage,
  getLogin,
  getSignUp,
  getSignupVerification,
  getNotActive,
  getAccountActive,
  getForgotPassword,
  getResetPassword,
  getProfile
} = require('../controller/viewsController');

const {
  getGyms,
  getGymAdminDashboard,
  getAddGym,
  viewGym,
  editGym
  // deleteGym
} = require('../controller/gymController');

const {
  isLoggedIn,
  protect,
  activate
} = require('../controller/authController');

const router = express.Router();

router.get('/', isLoggedIn, getHomePage);
router.get('/login', isLoggedIn, getLogin);
router.get('/signup', isLoggedIn, getSignUp);
router.get('/verification', isLoggedIn, getSignupVerification);
router.get('/accountNotActivated', isLoggedIn, getNotActive);
router.get('/accountActive', isLoggedIn, getAccountActive);
router.get('/forgotPassword', isLoggedIn, getForgotPassword);
router.get('/resetPassword', isLoggedIn, getResetPassword);
router.get('/profile', protect, getProfile);
router.get('/activate/:token', activate);

router.get('/gymadmin', protect, getGymAdminDashboard);
router.get('/gymadmin/gyms', protect, getGyms);
router.get('/gymadmin/gyms/:slug', protect, viewGym);
router.get('/gymadmin/gyms/edit/:slug', protect, editGym);
router.get('/gymadmin/addGym', protect, getAddGym);

module.exports = router;
