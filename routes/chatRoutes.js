// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessageToGemini } = require('../services/geminiService');
const Chat = require('../models/chat');

// Chat with AI
router.post('/chat', async (req, res) => {
  const { message, artistName, userId } = req.body;

  // Simple keyword check to ensure relevance
  if (!message.toLowerCase().includes(artistName.toLowerCase())) {
    return res.json({
      reply: 'I can only answer questions about the artist and their music.',
    });
  }

  try {
    // Retrieve the last conversation ID for the user and artist
    const lastChat = await Chat.findOne({ userId, artistName }).sort({ timestamp: -1 });

    const conversationId = lastChat ? lastChat.conversationId : null;

    // Send message to Gemini API
    const { reply, conversationId: newConversationId } = await sendMessageToGemini(message, artistName, conversationId);

    // Save chat to MongoDB
    const chat = new Chat({
      userId,
      artistName,
      message,
      reply,
      conversationId: newConversationId || conversationId,
    });
    await chat.save();

    res.json({ reply });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({ error: 'Error processing chat message' });
  }
});

// Get Chat History
router.get('/chat/history', async (req, res) => {
  const { userId, artistName } = req.query;
  try {
    const chats = await Chat.find({ userId, artistName }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Error fetching chat history' });
  }
});

module.exports = router;
