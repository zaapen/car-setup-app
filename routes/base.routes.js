const express = require('express');

const Carsetup = require('../models/carSetup.model');

const router = express.Router();

// Routes

router.get('/', (req, res) => {
  res.redirect('/allsetup');
});

router.get('/allsetup', async (req, res, next) => {
  let carSetups;

  try {
    carSetups = await Carsetup.findAllPublic();
  } catch (error) {
    next(error);
    return;
  }

  res.render('all-car-setup', { userCarSetups: carSetups });
})

router.get('/401', (req, res) => {
  res.status(401).render('./shared/errorView', { errorType: '401' });
});

module.exports = router;
