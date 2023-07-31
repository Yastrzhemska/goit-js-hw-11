import axios from 'axios';


export async function fetchPhotos(query, page, perPage) {
    const BASE_URL = "https://pixabay.com/api/";
    const API_KEY = "38546715-4d682c7e02fe616ff7ac9c25a";
    const URL = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
    
    const response = await axios.get(URL);
    return response.data;    
}
// console.log(fetchPhotos());