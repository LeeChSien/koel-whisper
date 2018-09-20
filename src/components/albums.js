import React, { Component, rect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListView, Divider, Title, Caption, TouchableOpacity } from '@shoutem/ui';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';
import { inject, observer } from "mobx-react";
import FastImage from 'react-native-fast-image';
import moment    from 'moment';

import PlayerController from '../controllers/playerController';

@inject('library', 'player', 'tab')
@observer
class Albums extends Component {
  getLength(album) {
    let seconds = 0;

    album.songs.forEach((song)=>{
      seconds += song.length;
    });

    return moment().startOf('day')
            .seconds(seconds)
            .format('H:mm:ss');
  }

  renderRow(album) {
    let { library, player, tab } = this.props;

    return (
      <TouchableOpacity onPress={()=>{
        PlayerController.loadSongs(album.songs).then(()=>{
          PlayerController.playSong(player.play_list[0]);
          tab.setIndex(2);
        });
      }}>
        <View style={styles.itemContainer}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: album.cover }}
            style={styles.image}
          />
          <View style={styles.descContainer}>
            <Title style={styles.name} numberOfLines={1}>{album.name}</Title>
            <Caption>{album.songs.length} Songs • {this.getLength(album)}</Caption>
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
            <Rect x="84" y="12" rx="4" ry="4" width="200" height="15" />
            <Rect x="84" y="36" rx="4" ry="4" width="80" height="10" />
            <Rect x="12" y="12" rx="0" ry="0" width="60" height="60" />
          </ContentLoader> :
          <ListView
            data={library.albums}
            renderRow={this.renderRow.bind(this)}
          />}
      </View>
    );
  }

}

export default Albums

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  image: {
    width: 60,
    height: 60,
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
