// controllers/torrentController.js

const path = require('path'); // Add this line  
const { externalSearch, uploadTorrentFile, handleMagnetLink } = require('../services/torrentService');  

const searchTorrents = (req, res) => {  
  const { url } = req.query;  
  externalSearch(url)  
    .then(data => {
      // Ensure the data is in the expected format
      if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid response format from external API' });
      }
      res.json(data);
    })  
    .catch(err => res.status(500).json({ error: err.message }));  
};    

const uploadTorrent = (req, res) => {  
  if (req.file) {  
    console.log('Uploaded file details:', req.file); // Debugging log  

    // Check the file extension as a backup  
    const extname = path.extname(req.file.originalname);  

    // Ensure we're properly validating the file type  
    if (req.file.mimetype !== 'application/x-bittorrent' && extname !== '.torrent') {  
      return res.status(400).json({ error: 'Invalid file type. Please upload a .torrent file.' });  
    }  
    
    uploadTorrentFile(req.file.path)  
      .then(() => res.status(200).json({ message: 'File uploaded and processed successfully!' }))  
      .catch(err => res.status(500).json({ error: err.message }));  
  } else {  
    console.error('No file uploaded:', req.file);   
    res.status(400).json({ error: 'No file uploaded' });  
  }  
};  

const processMagnetLink = (req, res) => {  
  const { magnetLink } = req.body;  
  if (!magnetLink) {  
    return res.status(400).json({ error: 'Magnet link is required' });  
  }  

  handleMagnetLink(magnetLink)  
    .then(data => res.json(data))  
    .catch(err => res.status(500).json({ error: err.message }));  
};  

module.exports = { searchTorrents, uploadTorrent, processMagnetLink };