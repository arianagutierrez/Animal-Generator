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
      await getAnimalInfo()
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

//to get the animal's info
async function getAnimalInfo() {
  const [nameResponse, imageResponse] = await Promise.all([
    fetch('/animalname'),
    fetch('/animalimage'),
  ]);

  const nameData = await nameResponse.json();
  const imageData = await imageResponse.json();

  //to get animalName
  if (!nameData || nameData.length === 0) {
    console.log('Animal not available!');
    errorName.style.display = 'block';
    return;
  } else {
    errorName.style.display = 'none';
  }

  let animalItems = nameData[Math.floor(Math.random() * nameData.length)];
  let animalName = animalItems.name;
  console.log(animalName);

  let name = document.createElement('p');
  name.id = 'animalName';
  name.textContent = animalName;

  //to get animalImage
  let animalImage = imageData.photos[Math.floor(Math.random() * imageData.photos.length)];
  let animalImageURL = animalImage.src.medium;
  let animalAlt = animalImage.alt;
  console.log(animalImage);

  let img = document.createElement('img');
  img.id = 'animalImage';
  img.src = animalImageURL;
  img.alt = animalAlt;

  animalWrapper.appendChild(name);
  animalWrapper.appendChild(img);
}