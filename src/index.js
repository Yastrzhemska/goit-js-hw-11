import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';


const selectors = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more')
}
console.log(selectors);


let page = 1; 
let query = '';
const perPage = 40;

selectors.btnLoadMore.classList.add('is-hidden');

selectors.form.addEventListener('submit', hendlerSearch);
selectors.btnLoadMore.addEventListener('click', hendlerLoadMore);

async function hendlerLoadMore() {
    page += 1;
    // simpleLightBox.destroy();

    fetchPhotos(query, page, perPage)
        .then(data => {
            createMarkup(data.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();

            const totalPages = Math.ceil(data.totalHits / perPage);
            if (page > totalPages) {
                Notiflix.Notify.failure(
                    "We're sorry, but you've reached the end of search results.", {
                    timeout: 2000,
                    width: '400px'
                });
            }
        })
        .catch(err => console.log(err));

}

async function hendlerSearch(evt) {
    evt.preventDefault();
    page = 1;
    
    query = evt.currentTarget.elements.searchQuery.value.trim();
    selectors.gallery.innerHTML = '';
// selectors.btnLoadMore.classList.remove('is-hidden');
    if (query === '') {
        Notify.failure('Enter your request, please!', {
            timeout: 2000,
            width: '400px'
        });
        return;
        
    }

function checkIfEndOfPage() {
    return (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
    );
}

    window.addEventListener('scroll', showLoadMore);

    function showLoadMore() {
    if (checkIfEndOfPage()) {
    hendlerLoadMore();
    }
    }
    
    fetchPhotos(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
                    timeout: 2000,
                    width: '400px'
                }
                );
            } else {
                createMarkup(data.hits);
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, {
                    timeout: 2000,
                    width: '400px'
                });
            }
        })
        .catch(err => console.log(err))
        .finally(() => { selectors.form.reset()});
}

// ---------------------------Пошук зображень

async function fetchPhotos(query, page, perPage) {
    const BASE_URL = "https://pixabay.com/api/";
    const API_KEY = "38546715-4d682c7e02fe616ff7ac9c25a";
    const URL = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    
    const response = await axios.get(URL);
    return response.data;    
}
console.log(fetchPhotos());

// ---------------------------Створення розмітки

function createMarkup(images) {
    const markup = images
        .map(image => {
            const {
                id,
                largeImageURL,
                webformatURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            } = image;
            return `
        <a class="gallery__link" href="${largeImageURL}">
        <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
            <p class="info-item"><b>Likes</b>${likes}</p>
            <p class="info-item"><b>Views</b>${views}</p>
            <p class="info-item"><b>Comments</b>${comments}</p>
            <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
        </div>
        </a>`;
        })
        .join('');

    selectors.gallery.insertAdjacentHTML('beforeend', markup);
}