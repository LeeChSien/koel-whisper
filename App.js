import React, { Component } from 'react';

import { createStackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react';

import Login    from './src/components/login';
import Explorer from './src/components/explorer';

import libraryStore from './src/stores/libraryStore';
import playerStore  from './src/stores/playerStore';
import tabStore     from './src/stores/tabStore';
import userStore    from './src/stores/userStore';

const StackNavigator = createStackNavigator(
  {
    Login: Login,
    Explorer: Explorer,
  },
  {
    initialRouteName: 'Explorer',
  }
);

const stores = {
  library: libraryStore,
  player:  playerStore,
  tab:     tabStore,
  user:    userStore
}

const App = () => (
  <Provider {...stores}>
    <StackNavigator />
  </Provider>
)

export default App
