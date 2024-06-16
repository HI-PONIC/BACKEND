const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(403).json({ error: true, message: 'Invalid token' });
        }
    
        //console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
