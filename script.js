const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const fav = document.getElementById("fav")
const load = document.getElementById("load");
const loadMore = document.getElementById("loadMore");
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

const showContent = (page) => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
  if (page === "results") {
      resultsNav.classList.remove('hidden');
      favoritesNav.classList.add('hidden');
      console.log('result if');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
    console.log('result else');
  }  
}

const createDOMNodes = (page) => {
  const currentArray = page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add('card-img-top');
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === "results") {
      saveText.textContent = "Add to Favorites";
      saveText.addEventListener('click', () => {
        saveFavorite(result.url);
      });
    } else {
      saveText.textContent = "Remove from Favorites";
      saveText.addEventListener('click', () => {
        deleteFavorite(result.url);
      });
    }
    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement('div');
    footer.classList.add('text-muted');
    // Date
    const date = document.createElement('Strong');
    date.textContent = result.date;
    // Copyright
    const copyrightResult = result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = `${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.append(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  })
}

const updateDOM = (page) => {
  // Get Favorites from Local Storage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  // Clear Images Container
  imagesContainer.textContent  = "";
  createDOMNodes(page);
  showContent(page);
}

// Get 10 Images from NASA API
const getNasaPictures = async () => {
  // Show Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log(error);
  }
}

// Add result to Favorites
const saveFavorite = (itemUrl) => {
  // Loop through Results array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      // Add to Favorites
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 seconds
      saveConfirmed.classList.remove('hidden');
      setTimeout(() => {
        saveConfirmed.classList.add('hidden');
      }, 2000);
      // Set Favorite to Local Storage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  })
}

// Remove item from Favorites
const deleteFavorite = (itemUrl) => {
  if (favorites[itemUrl]) {
    // Remove from Favorites
    delete favorites[itemUrl];
    // Set Favorite to Local Storage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// Event Listeners
fav.addEventListener('click', () => {
  updateDOM("favorites");
});

load.addEventListener('click', () => {
  getNasaPictures();
})
loadMore.addEventListener('click', () => {
  getNasaPictures();
})

// On Load
getNasaPictures();
