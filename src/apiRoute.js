import UserStore from './stores/userStore';
import { host as Host } from '../app.json';

export default {
  login: () => `${Host}/api/me`,
  me: () => `${Host}/api/me?jwt-token=${UserStore.user.token}`,
  data: () => `${Host}/api/data?jwt-token=${UserStore.user.token}`,
  play: (id, time=0, format='mp3', bitrate=320) =>  `${Host}/api/${id}/play/${format}/${bitrate}?jwt-token=${UserStore.user.token}&time=${time}`,
}
