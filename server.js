require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require("./db/conn");
const User = require("./model/user.model");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "*"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'));
dotenv.config({ path: "config.env" });

// Function to format time difference
function formatTimeDifference(milliseconds) {
    if (!milliseconds) return '0 minutes';

    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    let result = '';
    if (minutes > 0) {
        result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    if (seconds > 0) {
        if (result) result += ' ';
        result += `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    return result || '0 seconds';
}

// API Routes
app.get('/api/users', async(req, res) => {
    try {
        const accounts = await User.find();
        const totalUsers = accounts.length;

        // Calculate average time between creation and last login
        const validAccounts = accounts.filter(account => account.last_logged_in && account.created_at);
        const totalTimeDiff = validAccounts.reduce((acc, account) => {
            const timeDiff = new Date(account.last_logged_in) - new Date(account.created_at);
            return acc + timeDiff;
        }, 0);

        const avgTimeToCreate = validAccounts.length > 0 ? totalTimeDiff / validAccounts.length : 0;

        // Format the user data
        const formattedUsers = accounts.map(account => {
            const timeDiff = account.last_logged_in && account.created_at ?
                new Date(account.last_logged_in) - new Date(account.created_at) :
                null;

            return {
                ...account.toObject(),
                timeSinceCreation: timeDiff ? formatTimeDifference(timeDiff) : 'N/A'
            };
        });

        res.json({
            users: formattedUsers,
            stats: {
                totalUsers,
                avgTimeToCreate: formatTimeDifference(avgTimeToCreate)
            }
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});