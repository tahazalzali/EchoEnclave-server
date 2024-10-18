// services/geminiService.js
const axios = require('axios');

async function sendMessageToGemini(message, artistName, conversationId = null) {
  try {
    // Construct the API request
    const requestBody = {
      messages: [
        { role: 'system', content: `You are an expert on ${artistName}.` },
        { role: 'user', content: message },
      ],
      // Include conversation ID if available for context
      ...(conversationId && { conversation_id: conversationId }),
    };

    const response = await axios.post(
      'https://gemini-api.google.com/v1/chat/completions',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
      }
    );

    // Extract the reply and conversation ID from the response
    const reply = response.data.choices[0].message.content;
    const newConversationId = response.data.conversation_id;

    return { reply, conversationId: newConversationId };
  } catch (error) {
    console.error('Error communicating with Gemini API:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  sendMessageToGemini,
};
