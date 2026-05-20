const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const { uploadSingleImage } = require('../middleware/upload');

const {
    createArticle,
    updateArticle, 
    getArticles, 
    getArticleById,
    deleteArticle,
    getMyArticles,        
    getLeaderboard        
} = require('../controllers/articleController.js');

router.get('/', getArticles);
router.get('/leaderboard', getLeaderboard);           
router.get('/my/articles', protect, getMyArticles);   
router.get('/:id', getArticleById);
router.post('/', protect, uploadSingleImage, createArticle);
router.put('/:id', protect, uploadSingleImage, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;