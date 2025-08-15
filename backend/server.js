require('dotenv').config(); // must be FIRST

const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Import Routes
const medicalRoutes = require('./routes/medical');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to the database and log errors
connectDB().catch((err) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/medical', medicalRoutes);

// Frontend static assets
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// SPA fallback (client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error('❌ Internal Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
