
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: true, message: 'Email already registered' });
        }

        // Hash the password and create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(username, hashedPassword, email);
        res.status(201).json({ error: false, message: 'User Created' });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.login = async (req, res) => {
    //console.log('Request Body:', req.body);  // Debugging log

    const { email, identifier, password } = req.body;
    const userEmail = email || identifier;

    try {
        if (!userEmail) {
            console.log('Email not provided in request body');
            return res.status(400).json({ error: true, message: 'Email not provided' });
        }

        const user = await User.findByEmail(userEmail);
        if (!user) {
            console.log('User not found for email:', userEmail);
            return res.status(400).json({ error: true, message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Invalid password for email:', userEmail);
            return res.status(400).json({ error: true, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            error: false,
            message: 'success',
            loginResult: {
                userId: user.id,
                name: user.username,
                token: token
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.logout = async (req, res) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // (Optional) Perform any additional logout operations such as logging the event

        res.json({ error: false, message: 'Logout successful' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ error: true, message: 'Logout failed' });
    }
};

exports.changeUsername = async (req, res) => {
    const { newUsername } = req.body;

    try {
        // Get userId from the decoded token
        const userId = req.user.id;

        // Update the username in the database
        await User.updateUsername(userId, newUsername);

        res.json({ error: false, message: 'Username updated successfully' });
    } catch (err) {
        console.error('Error while changing username:', err);
        res.status(500).json({ error: true, message: 'Failed to update username' });
    }
};

exports.changePassword = async (req, res) => {
    const { newPassword, currentPassword } = req.body;

    try {
        // Get userId from the decoded token
        const userId = req.user.id; // Automatically retrieved from middleware

        // Verify the current password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: true, message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await User.updatePassword(userId, hashedPassword);

        res.json({ error: false, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error while changing password:', err);
        res.status(500).json({ error: true, message: 'Failed to change password' });
    }
};