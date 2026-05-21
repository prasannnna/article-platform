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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://article-platform-five.vercel.app',
  'https://article-platform-tun4.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());// For frontend connection
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

