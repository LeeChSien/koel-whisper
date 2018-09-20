import { observable, action } from 'mobx';

class TabStore {
  @observable state = {
    index: 0,
    routes: [
      { key: 'albums', title: 'Albums' },
      { key: 'artists', title: 'Artists' },
      { key: 'play_list', title: 'Play List' }
    ]
  }

  @action setIndex(index) {
    this.state = {
      index: index,
      routes: [
        { key: 'albums', title: 'Albums' },
        { key: 'artists', title: 'Artists' },
        { key: 'play_list', title: 'Play List' }
      ]
    }
  }
}

const tabStore = new TabStore();

export default tabStore;
