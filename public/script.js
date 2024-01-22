const form = document.getElementById('searchForm');
const newSearchTerm = document.getElementById('newSearchTerm');
const errorSearch = document.querySelector('.errorSearch');
const errorName = document.querySelector('.errorName');
const animalWrapper = document.querySelector('#animalWrapper');

//to declare the one-word rule allowed in the search
form.addEventListener('submit', function (event) {
  const value = newSearchTerm.value.trim();
  const words = value.split(' ');

  if (words.length > 1) {
    event.preventDefault();
    errorName.style.display = 'block';
    errorSearch.style.display = 'block';
    console.log('Please enter only one word!');
  } else {
    errorName.style.display = 'none';
    errorSearch.style.display = 'none';
  }
});

//to start the request
document
  .querySelector('#searchForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    //to update the search
    const newSearchValue = newSearchTerm.value;
    const updateResponse = await fetch('/setsearchterm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newSearchValue }),
    });

    //to generate
    const updateData = await updateResponse.json();
    if (updateData.success) {
      await getAnimalName();
    } else {
      console.error('The search term is invalid! Try again!');
    }
});

//to remove the previous data
document.querySelector('#btnLoad').addEventListener('click', () => {
  if (document.querySelector('#animalName') !== null) {
    document.querySelector('#animalName').remove();
  }
  if (document.querySelector('#animalImage') !== null) {
    document.querySelector('#animalImage').remove();
  }
});

//to get the animal's name
async function getAnimalName() {
  const response = await fetch('/animalname');
  const data = await response.json();

  if (!data || data.length === 0) {
    console.log('Animal not available!');
    errorName.style.display = 'block';
    return;
  } else {
    errorName.style.display = 'none';
  }

  let animalItems = data[Math.floor(Math.random() * data.length)];
  let animalName = animalItems.name;
  console.log(animalName);

  let animalNameDiv = document.createElement('div');
  animalNameDiv.id = 'animalName';
  animalNameDiv.textContent = animalName;
  animalWrapper.appendChild(animalNameDiv);

  getAnimalImage();
}

//to get the animal's image
async function getAnimalImage() {
  const response = await fetch('/animalimage');
  const data = await response.json();
  let animalImage = data.photos[Math.floor(Math.random() * data.photos.length)];
  let animalImageURL = animalImage.src.medium;
  let animalAlt = animalImage.alt;
  console.log(animalImage);

  let img = document.createElement('img');
  img.id = 'animalImage';
  img.src = animalImageURL;
  img.alt = animalAlt;
  animalWrapper.appendChild(img);
}
