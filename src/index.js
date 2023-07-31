import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';
import { selectors } from './selectors';
import { fetchPhotos } from './fetch';
import {createMarkup} from './markup';



let page = 1; 
let query = '';
const perPage = 40;

selectors.btnLoadMore.classList.add('is-hidden');

selectors.form.addEventListener('submit', hendlerSearch);
selectors.btnLoadMore.addEventListener('click', hendlerLoadMore);

async function hendlerLoadMore() {
    page += 1;

    fetchPhotos(query, page, perPage)
        .then(data => {
            createMarkup(data.hits);
            new SimpleLightbox('.gallery a').refresh();

            const totalPages = Math.ceil(data.totalHits / perPage);
            if (page === totalPages) {
                selectors.btnLoadMore.classList.add('is-hidden');
                Notiflix.Notify.failure(
                    "We're sorry, but you've reached the end of search results.", {
                    timeout: 2000,
                    width: '400px'
                });
                selectors.btnLoadMore.removeEventListener('click', hendlerLoadMore);
                window.removeEventListener('scroll', showLoadMore);
            }
            new SimpleLightbox('.gallery a').refresh();
        })
        .catch(err => console.log(err));

}


function showLoadMore() {
    if (checkIfEndOfPage()) {
    hendlerLoadMore();
    }
}
    
function checkIfEndOfPage() {
    return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight
    );
}

    window.addEventListener('scroll', showLoadMore);



async function hendlerSearch(evt) {
    evt.preventDefault();
    page = 1;
    selectors.gallery.innerHTML = '';
    query = evt.currentTarget.elements.searchQuery.value.trim();
    if (query === '') {
        Notify.failure('Enter your request, please!', {
            timeout: 2000,
            width: '400px'
        });
        return;
        
    }

    fetchPhotos(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                selectors.btnLoadMore.classList.add('is-hidden');
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
                    timeout: 2000,
                    width: '400px'
                }
                );
            } else {
                new SimpleLightbox('.gallery a').refresh();
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, {
                    timeout: 2000,
                    width: '400px'
                });
                createMarkup(data.hits);
                new SimpleLightbox('.gallery a').refresh();
            }
            if (data.totalHits > perPage) {
                selectors.btnLoadMore.classList.remove('is-hidden');
                window.addEventListener('scroll', showLoadMore);
            }
            selectors.form.reset();
        })
        .catch(err => console.log(err));
        
    
    
}
