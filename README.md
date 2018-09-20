This is a Koel mobile client for both iOS & Android.

<img src="https://raw.githubusercontent.com/LeeChSien/koel-whisper/master/doc/album.png" width="300px">.
<img src="https://raw.githubusercontent.com/LeeChSien/koel-whisper/master/doc/playlist.png" width="300px">.

## Features

- Login
- Fetch media library (Album, Artist)
- Streaming (mp3 / 320kbps)
- Background playback
- Play control in iOS Control Center

## Installation

Install npm packages.

`npm i`

Link native modules.

`react-native link`


## Debug on simulator

For iOS

`react-native run-ios`

For Android

`react-native run-android`

## Running on iOS device

You need to set your certificate in XCode first.

`react-native run-ios --device "Your Device Name" --configuration Release`
