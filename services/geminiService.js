// services/geminiService.js
const axios = require('axios');

async function sendMessageToGemini(message, artistName, conversationId = null) {
  try {
    const requestBody = {
      model: 'gemini-model-name', // Replace with the correct model name
      messages: [
        { role: 'system', content: `You are an expert on ${artistName}.` },
        { role: 'user', content: message },
      ],
      ...(conversationId && { conversation_id: conversationId }),
    };

    const response = await axios.post(
      'https://gemini-api.google.com/v1/chat/completions', // Replace with the correct endpoint
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    const newConversationId = response.data.conversation_id;

    return { reply, conversationId: newConversationId };
  } catch (error) {
    console.error('Error in sendMessageToGemini:', {
      message: error.message,
      responseData: error.response ? error.response.data : 'No response data',
      status: error.response ? error.response.status : 'No status',
      headers: error.response ? error.response.headers : 'No headers',
      stack: error.stack,
    });
        throw error;
  }
}

module.exports = {
  sendMessageToGemini,
};
