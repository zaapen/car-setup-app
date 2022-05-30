const express = require('express');

const carSetupController = require('../controllers/carsetup.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

// Routes

// router.get('/allsetup', carSetupController.getAllSetup);

router.get('/mysetups', carSetupController.getMySetup);

router.get('/mysetups/new', carSetupController.getNewSetup);

router.post('/mysetups/new', imageUploadMiddleware, carSetupController.createNewSetup);

router.get('/mysetups/:id', carSetupController.getCarSetupDetails);

router.get('/mysetups/:id/edit', carSetupController.getCarUpdateSetup);

router.post('/mysetups/:id', imageUploadMiddleware, carSetupController.updateCarSetup);

router.delete('/mysetups/:id', carSetupController.deleteCarSetup);

module.exports = router;