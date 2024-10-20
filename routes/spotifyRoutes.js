const express = require('express');
const router = express.Router();
const { getGenres, getArtistsByGenre, getArtistById } = require('../services/spotifyService');

// Get Genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await getGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// Get Artist by ID
router.get('/artist/:id', async (req, res) => {
  try {
    const artist = await getArtistById(req.params.id);
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching artist' });
  }
});

// Get Artists by Genre
router.get('/artists/:genre', async (req, res) => {
  try {
    const artists = await getArtistsByGenre(req.params.genre);
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching artists' });
  }
});

module.exports = router;
