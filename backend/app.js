// app.js

const express = require('express');  
const cors = require('cors');  
const torrentRoutes = require('./routes/torrentRoutes');  
const app = express();  

// Middleware  
app.use(cors({ origin: 'http://localhost:3000' }));  
app.use(express.json());

// Routes  
app.use('/api/torrents', torrentRoutes);  

// Start the server  
const port = 4000;  
app.listen(port, () => {  
  console.log(`Server running at http://localhost:${port}`);  
});