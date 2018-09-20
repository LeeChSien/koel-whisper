import { observable, action, computed } from 'mobx';
import moment from 'moment';

import ApiRoute from '../apiRoute';

import LibraryStore from './libraryStore';

class PlayerStore {
  @observable play_list = [];
  @observable playing_index = 0;
  @observable playing_url = null;

  @observable paused = false;
  @observable duration = 0;
  @observable base_position = 0;
  @observable current_position = 0;

  @action setPlayList(play_list) {
    this.play_list = play_list;
  }

  @action playSong(song, time=0) {
    for (let i in this.play_list) {
      if (this.play_list[i].id == song.id) {
        this.playing_index = i;
      }
      this.play_list[i].active = false;
    }
    this.play_list[this.playing_index].active = true;

    this.playing_url = `${ApiRoute.play(song.id, time)}`;

    this.paused = false;
    this.duration = song.length;
    this.base_position = time;
    this.current_position = time;
  }

  @action setPlayingIndex(playing_index) {
    this.playing_index = playing_index;
  }

  @action setPlayingIndex(playing_index) {
    this.playing_index = playing_index;
  }

  @action setPosition(current_time) {
    this.current_position = this.base_position + current_time;
  }

  @action togglePaused() {
    this.paused = !this.paused;
  }

  @action clear() {
    this.playing_url = null;
    this.paused = true;
    this.duration = 0;
    this.base_position = 0;
    this.current_position = 0;
  }

  @computed get getPastTime() {
    return moment().startOf('day')
            .seconds(this.current_position)
            .format('m:ss');
  }

  @computed get getPastRemain() {
    return moment().startOf('day')
            .seconds((this.duration + this.base_position) - (this.current_position + this.base_position))
            .format('m:ss');
  }

  @computed get getCurrentSong() {
    return this.play_list[this.playing_index];
  }

  @computed get getSongName() {
    return (this.play_list.length == 0) ? '' :
      `${this.getCurrentSong.track ? (this.getCurrentSong.track + ' - ') : ''}${this.getCurrentSong.title}`;
  }
}

const playerStore = new PlayerStore();

export default playerStore;
