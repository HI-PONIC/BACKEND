const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const iotRoutes = require('./routes/iotRoutes');
const mlRoutes = require('./routes/mlRoutes');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/password', passwordResetRoutes);
app.use('/iot',iotRoutes);
app.use('/predict', mlRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



