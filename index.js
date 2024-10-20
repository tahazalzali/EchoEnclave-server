  // index.js
  const express = require('express');
  const cors = require('cors');
  const mongoose = require('mongoose');
  require('dotenv').config();
  const { GoogleGenerativeAI } = require('@google/generative-ai');

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // MongoDB Connection
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/echoenclave', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  // Routes
  const spotifyRoutes = require('./routes/spotifyRoutes');
  const chatRoutes = require('./routes/chatRoutes');

  app.use('/api/spotify', spotifyRoutes);
  app.use('/api', chatRoutes);

  app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      res.json({ response: generatedText });
    } catch (error) {
      console.error('Error communicating with Gemini AI:', error.message);
      res.status(500).json({ error: 'Failed to communicate with Gemini AI.' });
    }
  });


  // Start Server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
