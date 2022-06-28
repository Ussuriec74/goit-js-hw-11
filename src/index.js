import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
import { ImageApiService } from "./js/fetchImages";
import { createGalleryMarkup } from "./js/createGalleryMarkup";


const searchFormRef = document.querySelector("#search-form");
const galleryRef = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

const imageApiService = new ImageApiService();
const lightbox = new SimpleLightbox('.gallery a', { captionDelay
    : 300,
});


searchFormRef.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", fetchImages)

loadMoreBtn.classList.add('is-hidden');

function onSearch(event) {
  event.preventDefault();
  const inputValue = event.currentTarget.elements.searchQuery.value.trim();
  if (inputValue === "") {
    return Notify.info("Please enter the request parameters in the form.");
  }
  imageApiService.searchQuery = inputValue;
  loadMoreBtn.classList.remove('is-hidden');
  imageApiService.resetPage();
  clearGallery();

  clearGallery();
  fetchImages()
}

function clearGallery() {
  galleryRef.innerHTML = "";
}

function fetchImages() {
    // loadMoreBtn.disabled();
    imageApiService.fetchImages().then(({data}) => {
        if (data.total === 0) {
            Notify.info(`Sorry, there are no images matching your search query: ${imageApiService.searchQuery}. Please try again.`);
            loadMoreBtn.hide();
            return;
        }
        appendImagesMarkup(data);
        // onPageScrolling()
        lightbox.refresh();
        const { totalHits } = data;

        if (galleryRef.children.length === totalHits ) {
            Notify.info(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.classList.add('is-hidden');
        } else {
            loadMoreBtn.classList.remove('is-hidden');
            Notify.success(`Hooray! We found ${totalHits} images.`);
        }
    }).catch(error => console.log(error));
}

function appendImagesMarkup(data) {
    galleryRef.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
}

