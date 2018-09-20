import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { TextInput, Button, Heading, Subtitle, Divider, TouchableOpacity, Caption } from '@shoutem/ui';
import DropdownAlert from 'react-native-dropdownalert';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Video from 'react-native-video';
import { inject, observer } from "mobx-react";

import Albums   from './albums';
import Artists  from './artists';
import PlayList from './playList';

import LoginController  from '../controllers/loginController';
import PlayerController from '../controllers/playerController';

const ThemeColor = 'rgba(34, 34, 34, 1)';

@inject('library', 'player', 'tab', 'user')
@observer
class Explorer extends Component {
  static navigationOptions = {
    title: 'Koel Whisper'
  };

  constructor(props) {
    super(props);

    this.state = {
      using_slide: false
    };
  }

  componentDidMount() {
    let { library } = this.props;

    LoginController.init().then((user)=>{
      library.fetchFromApi();
    }).catch(()=>{
      this.props.navigation.push('Login');
    });

    PlayerController.init();
  }

  render() {
    let { library, player, tab } = this.props;

    return (
      <View style={styles.container}>
        <DropdownAlert ref={ref => this.dropdown = ref} onClose={()=>{}} />

        <TabView
          navigationState={tab.state}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'albums':
                return <Albums />;
              case 'artists':
                return <Artists />;
              case 'play_list':
                return <PlayList />;
            }
          }}
          renderTabBar={props =>
            <TabBar
              {...props}
              labelStyle={{ color: ThemeColor }}
              indicatorStyle={{ backgroundColor: ThemeColor }}
              style={{ backgroundColor: 'white' }}
            />
          }
          onIndexChange={(index)=>{tab.setIndex(index)}}
          initialLayout={{
            height: 0,
            width: Dimensions.get('window').width
          }}
        />

        <View style={styles.playbackContainer}>
          <View style={styles.songNameContainer}>
            <Subtitle style={styles.songName} numberOfLines={1}>
              {(player.playing_url) ? player.getSongName : ''}
            </Subtitle>
          </View>
          <View style={styles.sliderContainer}>
            <Caption style={{paddingTop: 12, marginRight: 10,
              width: 35}}>{player.getPastTime}</Caption>
            <Slider style={{flex: 1}}
                    disabled={!player.playing_url }
                    minimumValue={0}
                    maximumValue={player.duration}
                    value={player.current_position}
                    onSlidingStart={()=>{
                      this.setState({using_slide: true});
                    }}
                    onSlidingComplete={(value)=>{
                      PlayerController.playSong(player.play_list[player.playing_index], value);
                      this.setState({using_slide: false});
                    }} />
            <Caption style={{paddingTop: 12, marginLeft: 10,
              width: 35, textAlign: 'right'}}>{player.getPastRemain}</Caption>
          </View>
          <View style={styles.controlContainer}>
            <View style={styles.controlWraper}>
              <TouchableOpacity style={styles.controlBtn}
                onPress={()=>{PlayerController.previousTrack()}}>
                <Icon name="fast-rewind" size={50} color={ThemeColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.controlWraper}>
              <TouchableOpacity style={styles.controlBtn}
                onPress={()=>{PlayerController.togglePaused()}}>
                {(player.paused) ?
                  <Icon name="play-circle-filled" size={50} color={ThemeColor} /> :
                  <Icon name="pause-circle-filled" size={50} color={ThemeColor} />}
              </TouchableOpacity>
            </View>
            <View style={styles.controlWraper}>
              <TouchableOpacity style={styles.controlBtn}
                onPress={()=>{PlayerController.nextTrack()}}>
                <Icon name="fast-forward" size={50} color={ThemeColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {(player.playing_url) ?
          <Video source={{uri: player.playing_url }}   // Can be a URL or a local file.
             ref={(ref) => {
               this.player = ref;
             }}
             bufferConfig={{
               minBufferMs: 20000,
               maxBufferMs: 400000,
               bufferForPlaybackMs: 10000,
               bufferForPlaybackAfterRebufferMs: 5000
             }}
             audioOnly={true}
             playInBackground={true}
             playWhenInactive={true}
             ignoreSilentSwitch={'ignore'}

             paused={player.paused}
             style={{ opacity: 0 }}
             onLoad={(currentPosition, duration)=>{
               PlayerController.loadSong();
             }}
             onEnd={(payload)=>{
               PlayerController.nextTrack();
             }}
             onProgress={(payload)=>{
               if (!this.state.using_slide) {
                 PlayerController.setPosition(payload.currentTime)
               }
             }} /> : null
        }
      </View>
    );
  }

}

export default Explorer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  songNameContainer: {
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 20,
    height: 20,
  },
  songName: {
    color: '#555'
  },
  playbackContainer: {
    borderTopColor: '#ccc',
    borderTopWidth: 0.5,
    width: '100%',
    height: 150,
    backgroundColor: 'white',
  },
  sliderContainer: {
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
  },
  controlContainer: {
    flexDirection: 'row'
  },
  controlWraper: {
    flex: 1,
    alignItems: 'center'
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
