if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

//the user's request to the server:
app.use(express.json());

let searchTerm = '';

app.post('/setsearchterm', (request, response) => {
  const { newSearchValue } = request.body;
  if (newSearchValue) {
    searchTerm = newSearchValue;
    response.json({ success: true, searchTerm });
  } else {
    response
      .status(400)
      .json({ success: false, error: 'The new search term was not provided!' });
  }
});

//access to the APIs:
app.get('/animalname', async (request, response) => {
  const fetchAPI = await fetch(
    `https://animals-by-api-ninjas.p.rapidapi.com/v1/animals?name=${searchTerm}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.API_KEY_NAME,
        'X-RapidAPI-Host': 'animals-by-api-ninjas.p.rapidapi.com',
      },
    }
  );

  const animalNameResponse = await fetchAPI.json();
  console.log(animalNameResponse);
  response.json(animalNameResponse);
});

app.get('/animalimage', async (request, response) => {
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
