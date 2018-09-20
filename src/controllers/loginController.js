import ApiRoute from '../apiRoute';
import UserStore from '../stores/userStore';

class LoginController  {
  init() {
    let promise = new Promise((resolve, reject)=>{
      UserStore.fetchFromStorage().then((user)=>{
        fetch(`${ApiRoute.me()}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          if (responseJson.email) {
            resolve(user);
          } else {
            this.login(email, password);
          }
        })
        .catch((error) => {
          // this.dropdown.alertWithType('error', 'Error', 'Network error.');
        });
      }).catch((err)=>{
        reject();
      });
    });

    return promise;
  }

  login(email, password) {
    let promise = new Promise((resolve, reject)=>{
      fetch(ApiRoute.login(), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      })

      .then((response) => {
        if (response.status != 401) {
          return response.json();
        } else {
          reject('Invalid email or password.');
          return null;
        }
      })

      .then((responseJson) => {
        if (responseJson) {
          if (responseJson.email) {
            reject(responseJson.email[0]);
          } else if (responseJson.password) {
            reject(responseJson.password[0]);
          } else {
            UserStore.setToStorage({ email, password, token: responseJson.token });
            resolve();
          }
        }
      })

      .catch((error) => {
        reject('Network error.');
      });
    });

    return promise;
  }
}

const loginController = new LoginController();

export default loginController;
