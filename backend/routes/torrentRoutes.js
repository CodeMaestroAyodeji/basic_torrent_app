// routes/torrentRoutes.js

const express = require('express');  
const { searchTorrents, uploadTorrent, processMagnetLink } = require('../controllers/torrentController');  
const upload = require('../middlewares/uploadMiddleware');  

const router = express.Router();  

// Route to handle external search  
router.get('/search', searchTorrents);  

// Route to handle file upload  
router.post('/upload', upload.single('torrentFile'), uploadTorrent); 

// New route to process magnet links  
router.post('/process-magnet', processMagnetLink);  

module.exports = router;