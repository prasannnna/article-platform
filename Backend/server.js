const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const connectDB =  require('./src/config/database.js');

dotenv.config(); // Loaading environment variables

const authRoutes = require('./src/routes/authRoutes');
const articleRoutes = require('./src/routes/articleRoutes');

const app = express(); // Initializing express

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL],
  credentials: true
}));// For frontend connection
app.use(express.json()) ;
app.use(express.urlencoded({extended:true})); // For parsing form data

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
    res.json({Message: "Server Started"})
});

app.use((err, req, res, next)=>{
    res.status(500).json({
        Message: "Error something went wrong!",
        error: err.message})
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Running at http://localhost:${PORT}`)
});

