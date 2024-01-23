if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const router = express.Router();

let searchTerm = '';

router.post('/setSearchTerm', (request, response) => {
  const { newSearchValue } = request.body;
  if (newSearchValue) {
    searchTerm = newSearchValue;
    response.json({ success: true, searchTerm });
  } else {
    response
      .status(400)
      .json({ success: false, error: 'The search term was not provided!' });
  }
});

router.get('/animalName', async (request, response) => {
    const fetchAPI = await fetch(
        `https://animals-by-api-ninjas.p.rapidapi.com/v1/animals?name=${searchTerm}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.API_KEY_NAME,
            'X-RapidAPI-Host': 'animals-by-api-ninjas.p.rapidapi.com',
          },
        }
    )

    const animalNameResponse = await fetchAPI.json();
    console.log(animalNameResponse);
    response.json(animalNameResponse);
});

router.get('/animalImage', async (request, response) => {
    const fetchAPI = await fetch(
        `https://api.pexels.com/v1/search?query=${searchTerm}&per_page=20&total_results=30`,
        {
          method: 'GET',
          headers: {
            Authorization: process.env.API_KEY_IMAGE,
          },
        }
    );
    
    const animalImageResponse = await fetchAPI.json();
    console.log(animalImageResponse);
    response.json(animalImageResponse);
});

module.exports = router;