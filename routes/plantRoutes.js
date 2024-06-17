const express = require('express');
const router = express.Router();
const multer = require('multer');
const plantController = require('../controllers/plantController');
const authenticateToken = require('../middleware/authMiddleware');

// Set up multer for file uploads
const storage = multer.memoryStorage(); // or use diskStorage if you want to save the files to disk
const upload = multer({ storage });

// Routes with authentication
router.get('/', authenticateToken, plantController.getPlantsByUser);
router.get('/monitoring/:id', authenticateToken, plantController.getPlantDataById);
router.get('/average/:id', authenticateToken, plantController.getPlantAverageById);
router.post('/', authenticateToken, upload.single('image'), plantController.addPlant);
router.put('/:id', authenticateToken, upload.single('image'), plantController.updatePlant);
router.delete('/:id', authenticateToken, plantController.deletePlant);

module.exports = router;
