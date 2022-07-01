import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
import { ImageApiService } from "./js/fetchImages";
import { createGalleryMarkup } from "./js/createGalleryMarkup";


const searchFormRef = document.querySelector("#search-form");
const galleryRef = document.querySelector(".gallery");
const loadMoreBtnRef = document.querySelector(".load-more");
const endlessScrollRef = document.querySelector(".endless-scroll");

const imageApiService = new ImageApiService();
let gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 300,
});


searchFormRef.addEventListener("submit", onSearch);
loadMoreBtnRef.addEventListener("click", fetchImages)

loadMoreBtnRef.classList.add('is-hidden');

function onSearch(event) {
  event.preventDefault();
  loadMoreBtnRef.classList.add('is-hidden');
  const inputValue = event.currentTarget.elements.searchQuery.value.trim();
  if (inputValue === "") {
    return Notify.info("Please enter the request parameters in the form.");
  }
  imageApiService.searchQuery = inputValue;
  loadMoreBtnRef.classList.remove('is-hidden');
  imageApiService.resetPage();
  clearGallery();

  fetchImages()

  const options = {
  rootMargin: '2px',
  threshold: 1.0
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchImages();
      }
    })
  }, options);

  observer.observe(endlessScrollRef);
}

function clearGallery() {
  galleryRef.innerHTML = "";
}

function fetchImages() {
  loadMoreBtnRef.classList.add('is-hidden');
  imageApiService.fetchImages().then(({ data }) => {
    if (data.total === 0) {
      Notify.info(`Sorry, there are no images matching your search query: ${imageApiService.searchQuery}. Please try again.`);
      loadMoreBtnRef.classList.add('is-hidden');
      return;
    }
    appendImagesMarkup(data);
    onPageScrolling()
    gallery.refresh();
    const { totalHits } = data;

    if (galleryRef.children.length === totalHits ) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtnRef.classList.add('is-hidden');
    } else {
        loadMoreBtnRef.classList.remove('is-hidden');
        endlessScrollRef.classList.remove('is-hidden');
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
  }).catch(error => console.log(error));
}

function appendImagesMarkup(data) {
    galleryRef.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
}

function onPageScrolling(){ 
    const { height: cardHeight } = galleryRef
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
}


