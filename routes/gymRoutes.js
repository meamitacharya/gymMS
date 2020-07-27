const express = require('express');

const {
  createGym,
  getAllGyms,
  getGym,
  deleteGym,
  updateGym
} = require('../controller/gymController');

const router = express.Router();

router
  .route('/')
  .get(getAllGyms)
  .post(createGym);

router
  .route('/:id')
  .get(getGym)
  .patch(updateGym)
  .delete(deleteGym);

module.exports = router;
