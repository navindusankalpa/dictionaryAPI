const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load dictionary data
const dictionaryPath = path.join(__dirname, 'src', 'en2sn.json');
let dictionaryData = {};

try {
  dictionaryData = JSON.parse(fs.readFileSync(dictionaryPath, 'utf8'));
} catch (err) {
  console.error('Failed to load dictionary data:', err);
}

function getSimilarWords(word) {
  return Object.keys(dictionaryData)
    .filter(key => key.startsWith(word))
    .slice(0, 5);
}

// API endpoint
app.get('/api', (req, res) => {
  const word = req.query.word?.toLowerCase().trim();

  if (!word) {
    return res.status(400).json({
      error: "Missing word parameter",
      example: "/api?word=example"
    });
  }

  const definitions = dictionaryData[word];

  if (!definitions) {
    return res.status(404).json({
      error: "Word not found",
      requestedWord: word,
      suggestions: getSimilarWords(word)
    });
  }

  res.status(200).json({
    requestedWord: word,
    sinhalaMeanings: definitions,
    count: definitions.length
  });
});

// Serve static frontend
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
