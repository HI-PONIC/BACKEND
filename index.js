const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const iotRoutes = require('./routes/iotRoutes');
const mlRoutes = require('./routes/mlRoutes');
const loadModel = require("./services/load_model");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/password', passwordResetRoutes);
app.use('/iot', iotRoutes);
app.use('/predict', mlRoutes);

const PORT = process.env.PORT || 3000;

// Initialize model variable
let model;

// Load the model once when the server starts
(async () => {
    try {
        model = await loadModel();
        console.log('Model loaded successfully');
        // Start the server only after the model has loaded
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to load model:', error);
        // Exit the process with a failure code if the model fails to load
    }
})();
