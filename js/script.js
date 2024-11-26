const body = document.querySelector('body');

const movies = document.querySelector('.movies');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');

const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

const input = document.querySelector('.input');

const MAX_PAGE = 18;
const MIN_PAGE = 0;

let moviesData = [];
let page = 0;

btnPrev.addEventListener('click', () => {
  if (page === 0) {
    page = MAX_PAGE;
  } else {
    page -= 6;
  }

  refreshMovies();
});

btnNext.addEventListener('click', () => {
  if (page === MAX_PAGE) {
    page = MIN_PAGE;
  } else {
    page += 6;
  }

  refreshMovies();
});

modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
  body.style.overflow = 'auto';
});

modal.addEventListener('click', () => {
  modal.classList.add('hidden');
  body.style.overflow = 'auto';
});

input.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;

  page = 0;
  if (input.value === '') {
    loadDiscoverMovies();
  } else {
    loadFilteredMovies(input.value);
  }

  input.value = '';
});

async function loadFilteredMovies(filter) {
  try {
    const response = await api.get(
      `/3/search/movie?language=pt-BR&include_adult=false&query=${filter}`
    );
    moviesData = response.data.results;
    refreshMovies();
  } catch (error) {
    console.log(error);
  }
}

async function fillMovieModal(movie) {
  modal.classList.remove('hidden');
  body.style.overflow = 'hidden';

  const response = await api.get(`/3/movie/${movie.id}?language=pt-BR`);
  const movieData = response.data;

  modalTitle.textContent = movieData.title;
  modalImg.src = movieData.backdrop_path;
  modalImg.alt = movieData.title;
  modalDescription.textContent = movieData.overview;

  modalGenres.innerHTML = '';
  movieData.genres.forEach((genre) => {
    const genreContainer = document.createElement('span');
    genreContainer.classList.add('modal__genre');
    genreContainer.textContent = genre.name;
    modalGenres.appendChild(genreContainer);
  });
  modalAverage.textContent = movieData.vote_average;
}

function createMovieCard(movie) {
  const movieContainer = document.createElement('div');
  movieContainer.classList.add('movie');
  movieContainer.style.backgroundImage = `url(${movie.poster_path})`;

  movieContainer.addEventListener('click', () => fillMovieModal(movie));

  const movieInfo = document.createElement('div');
  movieInfo.classList.add('movie__info');

  const movieTitle = document.createElement('span');
  movieTitle.classList.add('movie__title');
  movieTitle.textContent = movie.title;
  movieTitle.title = movie.title;

  const movieRating = document.createElement('span');
  movieRating.classList.add('movie__rating');

  const ratingStar = document.createElement('img');
  ratingStar.src = './assets/rating.svg';
  ratingStar.alt = 'Rating';

  const ratingNumber = document.createElement('span');
  ratingNumber.textContent = movie.vote_average;

  movieRating.appendChild(ratingStar);
  movieRating.appendChild(ratingNumber);
  movieInfo.appendChild(movieTitle);
  movieInfo.appendChild(movieRating);
  movieContainer.appendChild(movieInfo);

  movies.appendChild(movieContainer);
}

function refreshMovies() {
  movies.innerHTML = '';

  try {
    for (let i = page; i < page + 6; i++) {
      const movie = moviesData[i];

      if (!movie) {
        continue;
      }

      createMovieCard(movie);
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadDiscoverMovies() {
  try {
    const response = await api.get(
      '/3/discover/movie?language=pt-BR&include_adult=false'
    );
    const { results } = response.data;
    moviesData = results;
    refreshMovies();
  } catch (error) {
    console.log(error);
  }
}

async function loadHighlights() {
  try {
    const response = await api.get(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`
    );

    const movieData = response.data;

    highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url('${movieData.backdrop_path}') no-repeat center / cover`;
    highlightTitle.textContent = movieData.title;
    highlightRating.textContent = movieData.vote_average;
    highlightGenres.textContent = movieData.genres.map((genre) => genre.name).join(', ');
    highlightLaunch.textContent = new Date(movieData.release_date).toLocaleDateString(
      'pt-BR',
      { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
    );
    highlightDescription.textContent = movieData.overview;
  } catch (error) {
    console.log(error);
  }
}

async function playMovie() {
  try {
    const response = await api.get(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`
    );
    const { results } = response.data;
    const [firstVideo] = results;
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${firstVideo.key}`;
  } catch (error) {
    console.log(error);
  }
}

loadDiscoverMovies();
loadHighlights();
playMovie();
