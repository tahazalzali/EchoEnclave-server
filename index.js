const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://mongo:27017/echoenclave', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test Route
app.get('/', (req, res) => {
  res.send('EchoEnclave Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
