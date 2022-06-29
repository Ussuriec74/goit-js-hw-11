export { createGalleryMarkup };

function createGalleryMarkup({ hits }) {
  return hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
      `
    <div class="photo-card">
      <a class="photo-card-link" href="${largeImageURL}">
        <img class="photo-card-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: </b></br>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views: </b></br>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments: </b></br>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads: </b></br>
          ${downloads}
        </p>
      </div>
    </div>
    `)
    .join("");
}