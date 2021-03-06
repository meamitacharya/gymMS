const express = require('express');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  logout,
  activate
} = require('./../controller/authController');
const {
  getAllUsers,
  getUser,
  createNewUser,
  patchUser,
  updateMe,
  deleteMe
} = require('../controller/userController');

const { resizeUserPhoto, uploadUserPhoto } = require('../utils/uploadPhoto');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/activate/:token', activate);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser);

router
  .route('/:id')
  .get(getUser)
  .patch(patchUser);

module.exports = router;
