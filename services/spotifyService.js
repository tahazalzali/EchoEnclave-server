const axios = require('axios');

let accessToken = null;

// Get Spotify Access Token
async function getAccessToken() {
  if (accessToken) return accessToken;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.SPOTIFY_CLIENT_ID,
        password: process.env.SPOTIFY_CLIENT_SECRET,
      },
    }
  );

  accessToken = response.data.access_token;
  // Token expires in 1 hour
  setTimeout(() => {
    accessToken = null;
  }, 3600 * 1000);

  return accessToken;
}

async function getArtistById(id) {
  const token = await getAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}


// Get Genres
async function getGenres() {
  const token = await getAccessToken();
  const response = await axios.get(
    'https://api.spotify.com/v1/recommendations/available-genre-seeds',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.genres;
}

// Get Artists by Genre
async function getArtistsByGenre(genre) {
  const token = await getAccessToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: `genre:"${genre}"`,
      type: 'artist',
      limit: 20,
    },
  });
  return response.data.artists.items;
}

module.exports = {
  getGenres,
  getArtistsByGenre,
  getArtistById,
};
