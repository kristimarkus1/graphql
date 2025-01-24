const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files 
app.use(express.static(path.join(__dirname, '/')));

// Serve the main app page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(500).send("Error loading the homepage.");
    }
  });
});

// Serve the login page (login.html)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'), (err) => {
    if (err) {
      console.error("Failed to send login.html:", err);
      res.status(500).send("Error loading the login page.");
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});