const express = require('express');

const iotController = require('../controllers/iotController');

const router = express.Router();


router.get('/device/allSensor', iotController.getAllSensor);
router.get('/device/average', iotController.getAverage);
module.exports = router;