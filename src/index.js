import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';
// import { createMarkup } from './markup';




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

async function hendlerSearch(evt) {
    evt.preventDefault();
    page = 1;
    selectors.btnLoadMore.classList.remove('is-hidden');
    query = evt.currentTarget.elements.searchQuery.value.trim();
    selectors.gallery.innerHTML = '';

    if (query === '') {
        Notify.failure('Enter your request, please!', {
            timeout: 4000,
            width: '400px'
        });
        return;
    }

    function hendlerLoadMore() {
    
}

// async function hendlerLoadMore() {
//   const searchString = selectors.form.searchQuery.value.split(' ').join('+');
//   page += 1;
//   const images = await fetchPhotos(searchString, page);
//   selectors.gallery.insertAdjacentHTML('beforeend', await createMarkup(images.hits));
//   lightbox.refresh();
//   refs.pgnum.textContent = `Page ${page}`;
//   if (page >= 13) {
//     console.log('page= ', page);
//     refs.btnMore.style.display = 'none';
//     Notify.info("We're sorry, but you've reached the end of search results.", optNotiflx);
//   }
// }
    
    fetchPhotos(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
                    timeout: 4000,
                    width: '400px'
                }
                );
            } else {
                createMarkup(data.hits);
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, {
                    timeout: 4000,
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
    // Перевірка чи існує галерея перед вставкою даних
    // if (!gallery) {
    //     return;
    // }

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