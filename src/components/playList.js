import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView } from 'react-native';
import { Divider, Title, Caption, TouchableOpacity } from '@shoutem/ui';
import FastImage from 'react-native-fast-image'
import { observer, inject } from "mobx-react";

import moment from 'moment';

import PlayerController from '../controllers/playerController';

@inject('library', 'player')
@observer
class PlayList extends Component {
  componentDidMount() {

  }

  getLength(song) {
    return moment().startOf('day')
            .seconds(song.length)
            .format('mm:ss');
  }

  playSong(song) {
    PlayerController.playSong(song);
  }

  renderRow(song) {
    let { library, player } = this.props;

    return (
      <TouchableOpacity onPress={this.playSong.bind(this, song)}>
        <View style={[styles.itemContainer, {
          backgroundColor: (song.active) ?
            'white' : null
        }]} key={song.id}>
          <View style={{
            width: 0,
            height: 90,
            backgroundColor: 'rgba(34, 34, 34, 1)',
            marginRight: 12
          }}></View>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: library.albums_hash[`_${song.album_id}`].cover, priority: FastImage.priority.high }}
            style={styles.image}
          />
          <View style={styles.descContainer}>
            <Title style={styles.name} numberOfLines={1}>
              {(song.track != 0) ? `${song.track} - ` : ''}{song.title}
            </Title>
            <Caption style={styles.description}>{library.albums_hash[`_${song.album_id}`].name} •  {library.artists_hash[`_${song.artist_id}`].name} • {this.getLength(song)}</Caption>
          </View>
          <View style={styles.actionContainer}>
          </View>
        </View>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    let { player } = this.props;

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.active != r2.active});
    let dataSource = ds.cloneWithRows(player.play_list);

    return (
      <View style={styles.container}>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }

}

export default PlayList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingRight: 12,
  },
  image: {
    marginTop: 12,
    width: 60,
    height: 60,
  },
  descContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    paddingTop: 12,
  },
  name: {
    fontSize: 15,
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  actionContainer: {
    width: 0
  }
});
