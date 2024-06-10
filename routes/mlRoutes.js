const express = require('express');
const multer = require('multer');
const predictController = require('../controllers/predictController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post('/plant/condition', upload.single('image') ,predictController.postPredictHandler);

module.exports = router;