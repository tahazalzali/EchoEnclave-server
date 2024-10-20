// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { sendMessageToGemini } = require("../services/geminiService");
const Chat = require("../models/Chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Get Chat History
router.get("/chat/history", async (req, res) => {
  const { userId, artistName } = req.query;
  try {
    const chats = await Chat.find({ userId, artistName }).sort({
      timestamp: 1,
    });
    res.json(chats);
  } catch (error) {
    console.error("Error in /chat/history route:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching chat history." });
  }
});

router.post("/chat/feedback", async (req, res) => {
  const { chatId, feedback } = req.body;

  try {
    await Chat.findByIdAndUpdate(chatId, { feedback });
    res.json({ message: "Feedback recorded" });
  } catch (error) {
    console.error("Error recording feedback:", error);
    res.status(500).json({ error: "Error recording feedback" });
  }
});

//Generate explain api for chat
router.post("/chat/explain", async (req, res) => {
  const { message, artistName, userId } = req.body;
  if (!message || !artistName) {
    return res
      .status(400)
      .json({ error: "Message and artistName are required." });
  }

  try {
    // Modify the prompt to focus on the artist's information
    const prompt = `
    You are Gemini, an intelligent assistant specialized in information about various artists.
    Explain the response generated for the user message about the artist **${artistName}**.
    
    **Message that is not clear to regenrate and explain more:** ${message}
    
    **Instructions:**
    1. **Understand Context:** Assume that any pronouns in the user message (e.g., "she," "her," "they") refer to **${artistName}**.
    2. **Determine Relevance:** Analyze whether the user message relates to **${artistName}**.
    3. **Explain Response:** Provide a detailed explanation of the response with note to generate a new one without talking about the given message, so take the message, analyze it, and give the only new data more explained without talking about the old one , be sure it is related to  **${artistName}**.

    **Response:**
    `;
  
    const result = await model.generateContent(prompt);
    
    const generatedText = result.response.text();
    // Retrieve the latest conversation ID for the user and artist
    const lastChat = await Chat.findOne
    ({ userId, artistName }).sort({
      timestamp: -1,
    });
    const conversationId = lastChat ? lastChat.conversationId : null;

    // Save the conversation to the database
    const chat = new Chat({
      userId,
      artistName,
      message,
      reply: generatedText,
      conversationId: conversationId,
    });
    await chat.save();
    res.json({ artist: artistName, response: generatedText });
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error.message);
    res.status(500).json({ error: "Failed to communicate with Gemini AI." });
  }
});



// Generate content using Google Gemini AI
router.post("/chat", async (req, res) => {
  const { message, artistName, userId } = req.body;
  if (!message || !artistName) {
    return res
      .status(400)
      .json({ error: "Message and artistName are required." });
  }

  try {
    // Modify the prompt to focus on the artist's information
    const prompt = `
    You are Gemini, an intelligent assistant specialized in information about various artists.
    
    **Artist:** ${artistName}
    
    **User Message:** ${message}
    
    **Instructions:**
    1. **Understand Context:** Assume that any pronouns in the user message (e.g., "she," "her," "they") refer to **${artistName}**.
    2. **Determine Relevance:** Analyze whether the user message relates to **${artistName}**.
    3. **Respond Accordingly:**
       - **If Related:** Provide a thoughtful and informative response about **${artistName}** based on the user's message.
       - **If Not Related:** Reply with the message: "Your message does not relate to ${artistName}."
        
    **Response:**
    `;
    
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    // Retrieve the latest conversation ID for the user and artist
    const lastChat = await Chat.findOne({ userId, artistName }).sort({
      timestamp: -1,
    });
    const conversationId = lastChat ? lastChat.conversationId : null;

    // Send the message to the Gemini API
    // const { aiReply, conversationId: newConversationId } = await sendMessageToGemini(conversationId, message, artistName);

    // Save the conversation to the database
    const chat = new Chat({
      userId,
      artistName,
      message,
      reply: generatedText,
      conversationId: conversationId,
    });
    await chat.save();
    res.json({ artist: artistName, response: generatedText });
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error.message);
    res.status(500).json({ error: "Failed to communicate with Gemini AI." });
  }
});
module.exports = router;
