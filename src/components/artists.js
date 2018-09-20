import React, { Component, rect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListView, Divider, Title, Caption, TouchableOpacity } from '@shoutem/ui';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';
import { inject, observer } from "mobx-react";

import moment from 'moment';

import PlayerController from '../controllers/playerController';

@inject('library', 'tab')
@observer
class Artists extends Component {
  getLength(artist) {
    let seconds = 0;

    artist.songs.forEach((song)=>{
      seconds += song.length;
    });

    return moment().startOf('day')
            .seconds(seconds)
            .format('H:mm:ss');
  }

  renderRow(artist) {
    let { library, tab } = this.props;

    return (
      <TouchableOpacity onPress={()=>{
        PlayerController.loadSongs(artist.songs).then(()=>{
          PlayerController.playSong(player.play_list[0]);
          tab.setIndex(2);
        });
      }}>
        <View style={styles.itemContainer}>
          <View style={styles.descContainer}>
            <Title style={styles.name} numberOfLines={1}>{artist.name}</Title>
            <Caption>{artist.songs.length} Songs • {this.getLength(artist)}</Caption>
          </View>
          <View style={styles.actionContainer}>
          </View>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    let { library } = this.props;

    return (
      <View style={styles.container}>
        {library.loading ?
          <ContentLoader height={300} primaryColor={'#ccc'} secondaryColor={'#bbb'}>
            <Rect x="12" y="12" rx="4" ry="4" width="200" height="15" />
            <Rect x="12" y="36" rx="4" ry="4" width="80" height="10" />
          </ContentLoader> :
          <ListView
            data={library.artists}
            renderRow={this.renderRow.bind(this)}
          />}
      </View>
    );
  }

}

export default Artists

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12
  },
  descContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12
  },
  name: {
    fontSize: 15,
    marginBottom: 5,
  },
  actionContainer: {
    width: 0
  }
});
