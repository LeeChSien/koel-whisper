import { observable, action } from 'mobx';
import Storage from '../storage';

class UserStore {
  @observable user = null;

  @action fetchFromStorage() {
    let promise = new Promise((resolve, reject)=>{
      Storage.load({
      	key: 'user',
      }).then(user => {
        this.user = user;
        resolve(user);
      }).catch(err => {
        reject(err);
        // this.props.navigation.push('Login', {getApiData: this.getApiData.bind(this)});
      });
    });

    return promise;
  }

  @action setToStorage(user) {
    Storage.save({
      key: 'user',
      data: {...user},
    });

    this.user = {...user};
  }
}

const userStore = new UserStore();

export default userStore;
