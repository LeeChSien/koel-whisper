import MusicControl from 'react-native-music-control';

import PlayerStore from '../stores/playerStore';
import LibraryStore from '../stores/libraryStore';

import ApiRoute from '../apiRoute';

class PlayerController {
  constructor() {
    this.togglePaused = this.togglePaused.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.previousTrack = this.previousTrack.bind(this);
  }

  init() {
    MusicControl.handleAudioInterruptions(true);
    MusicControl.enableControl('play', true)
    MusicControl.enableControl('pause', true)
    MusicControl.enableControl('nextTrack', true)
    MusicControl.enableControl('previousTrack', true)

    MusicControl.on('play', this.togglePaused);
    MusicControl.on('pause', this.togglePaused);
    MusicControl.on('nextTrack', this.nextTrack)
    MusicControl.on('previousTrack', this.previousTrack);
  }

  loadSongs(songs) {
    let promise = new Promise((resolve, reject)=>{
      let _songs = [...songs];

      _songs = _songs.sort((a, b) => {
        if (parseInt(a.disc) != parseInt(b.disc))
          return parseInt(a.disc) - parseInt(b.disc);

        if (parseInt(a.track) != parseInt(b.track))
          return parseInt(a.track) - parseInt(b.track);

        return parseInt(a.title) - parseInt(b.title);
      });

      PlayerStore.setPlayList(_songs);

      resolve(songs);
    });

    return promise;
  }

  playSong(song, time=0) {
    if (!song) { return; }

    PlayerStore.playSong(song, time);
  }

  loadSong() {
    let song = PlayerStore.getCurrentSong;

    MusicControl.setNowPlaying({
      title: song.title,
      state: MusicControl.STATE_BUFFERING,
      duration: song.length,
      artwork: LibraryStore.albums_hash[`_${song.album_id}`].cover,
      artist: LibraryStore.artists_hash[`_${song.artist_id}`].name,
      album: LibraryStore.albums_hash[`_${song.album_id}`].name
    });
  }

  setPosition(current_time) {
    PlayerStore.setPosition(current_time);

    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING,
      elapsedTime: PlayerStore.base_position + current_time
    })
  }

  togglePaused() {
    PlayerStore.togglePaused();

    MusicControl.updatePlayback({
      state: (PlayerStore.paused) ? MusicControl.STATE_PAUSED : MusicControl.STATE_PLAYING
    });
  }

  previousTrack() {
    let playing_index = parseInt(PlayerStore.playing_index) - 1;

    if (PlayerStore.playing_index >= 0) {
      this.playSong(PlayerStore.play_list[playing_index]);
    }
  }

  nextTrack() {
    let playing_index = parseInt(PlayerStore.playing_index) + 1;

    if (playing_index < PlayerStore.play_list.length) {
      this.playSong(PlayerStore.play_list[playing_index]);
    } else {
      PlayerStore.clear();
      MusicControl.resetNowPlaying();
    }
  }

}

const playerController = new PlayerController();

export default playerController;
