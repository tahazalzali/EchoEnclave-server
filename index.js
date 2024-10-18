// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/echoenclave', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
const spotifyRoutes = require('./routes/spotifyRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/spotify', spotifyRoutes);
app.use('/api', chatRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
