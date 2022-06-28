import axios from "axios";
export { ImageApiService };

axios.defaults.baseURL = 'https://pixabay.com/api';
const KEY = "28299403-f4195b0bf13d94bdbb03a95af";
const params = "image_type=photo&orientation=horizontal&safesearch=true&per_page=40";

class ImageApiService {
  constructor() {
    this.searchQuery = "";
    this.page = 1;
  }
  async fetchImages() {
    try {
      const responce = await axios.get(`/?key=${KEY}&q=${this.searchQuery}&page=${this.page}&${params}`);
      this.incrementPage();
      return responce;
    } catch (error) {
      alert("Error");
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
