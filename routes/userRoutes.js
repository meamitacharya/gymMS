const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect
} = require('./../controller/authController');
const {
  getAllUsers,
  getUser,
  createNewUser,
  patchUser,
  updateMe,
  deleteMe
} = require('../controller/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);
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
