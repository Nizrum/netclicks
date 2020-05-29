const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const description = document.querySelector('.description');
const rating = document.querySelector('.rating');
const genresList = document.querySelector('.genres-list');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';


const DBService = class {
    constructor () {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = '7bef955e1213b326352b8532930d2857';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();  
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }
    getTestData = () => {
        return this.getData('test.json');
    }
    getTestCard = () => {
        return this.getData('card.json');
    }
    getSearchResult = query => this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`);
    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
}

const renderCard = response => {
    tvShowsList.textContent = '';

    response.results.forEach(item => {

        const { 
            backdrop_path: backdrop, 
            name: title, 
            poster_path: poster, 
            vote_average: vote,
            id
        } = item;
        
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
            <a href="#" id=${id} class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        loading.remove();
        tvShowsList.append(card);
    });
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

{
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
}

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

tvShowsList.addEventListener('click', event => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    
    if (card) {
        new DBService().getTvShow(card.id)
            .then(data => {
                console.log(data);
                tvCardImg.src = IMG_URL + data.poster_path;
                modalTitle.textContent = data.name;
                genresList.textContent = '';
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                description.textContent = data.overview;
                rating.textContent = data.vote_average;
                modalLink.href = data.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            });  
    }
});

modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    
    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);