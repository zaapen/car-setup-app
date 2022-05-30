const express = require('express');

const baseController = require('../controllers/base.controller');

const router = express.Router();

// Routes

router.get('/', (req, res) => {
  res.redirect('/allsetups');
});

router.get('/allsetups', baseController.getAllPublicSetups);

router.get('/allsetups/:id', baseController.getPubCarSetup);

router.get('/401', (req, res) => {
  res.status(401).render('./shared/errorView', { errorType: '401' });
});

module.exports = router;
