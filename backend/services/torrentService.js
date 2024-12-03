// services/torrentService.js

const fs = require('fs');  
const path = require('path');  
const axios = require('axios');  
const db = require('../config/dbConfig');  
const { processTorrentFile } = require('../utils/fileUtils');  

function externalSearch(url) {  
  return axios  
    .get(url)  
    .then(response => response.data)  
    .catch(err => { 
      console.error('Error fetching external data:', err.message);
      throw new Error('Error fetching external data: ' + err.message); 
    });  
}  

function handleMagnetLink(magnetLink) {  
  return new Promise((resolve, reject) => {  
    console.log('Processing magnet link:', magnetLink);  
    
    const urlParams = new URLSearchParams(new URL(magnetLink).search);  
    const torrentName = urlParams.get('dn') || 'Unnamed Torrent';  
    const mockResponse = {  
      name: torrentName,  
      magnetLink: magnetLink,  
      seeds: 100,  
      leechers: 50,  
    };  

    db.query(  
      'INSERT INTO torrents (name, magnet_link, seeds, leechers) VALUES (?, ?, ?, ?)',  
      [mockResponse.name, mockResponse.magnetLink, mockResponse.seeds, mockResponse.leechers],  
      (err, result) => err ? reject(err) : resolve(mockResponse)  
    );  
  });  
}  

function uploadTorrentFile(filePath) {  
  return new Promise((resolve, reject) => {  
    const torrentData = processTorrentFile(filePath);  

    db.query(  
      'INSERT INTO torrents (name, magnet_link, seeds, leechers) VALUES (?, ?, ?, ?)',  
      [torrentData.name, torrentData.magnetLink, torrentData.seeds, torrentData.leechers],  
      (err, result) => err ? reject(err) : resolve(torrentData)  
    );  
  });  
}  

module.exports = { externalSearch, uploadTorrentFile, handleMagnetLink };