import { observable, action } from 'mobx';
import ApiRoute from '../apiRoute';

class LibraryStore {
  @observable albums       = [];
  @observable albums_hash  = [];
  @observable artists      = [];
  @observable artists_hash = [];
  @observable loading      = true;

  @action fetchFromApi() {
    this.loading = true;

    fetch(`${ApiRoute.data()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      let albums = responseJson.albums,
          albums_hash = {},
          artists = responseJson.artists,
          artists_hash = {};

      albums.forEach((album)=>{
        albums_hash[`_${album.id}`] = album;
        album.songs = [];
      });

      artists.forEach((artist)=>{
        artists_hash[`_${artist.id}`] = artist;
        artist.songs = [];
      });

      responseJson.songs.forEach((song)=>{
        if (song.album_id) {
          albums_hash[`_${song.album_id}`].songs.push(song);
        }

        if (song.artist_id) {
          artists_hash[`_${song.artist_id}`].songs.push(song);
        }
      });

      this.albums       = albums;
      this.albums_hash  = albums_hash;
      this.artists      = artists;
      this.artists_hash = artists_hash;
      this.loading      = false;
    })
    .catch((error) => {
      alert('Cannot connect to server.')
    });
  }
}

const libraryStore = new LibraryStore();

export default libraryStore;
