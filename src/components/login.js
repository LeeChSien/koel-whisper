import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, Heading } from '@shoutem/ui';
import DropdownAlert from 'react-native-dropdownalert';
import { inject, observer } from "mobx-react";

import LoginController from '../controllers/loginController'

@inject('library')
@observer
class Login extends Component {
  static navigationOptions = {
    headerLeft: (<View></View>),
    title: 'Koel Whisper'
  };

  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null
    };
  }

  login() {
    let library = this.props.library;

    LoginController.login(this.state.email, this.state.password).then(()=>{
      library.fetchFromApi();
      this.props.navigation.goBack();
    }).catch((err)=>{
      this.dropdown.alertWithType('error', 'Error', err);
    });
  }


  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <DropdownAlert ref={ref => this.dropdown = ref} onClose={()=>{}} />

        <Heading style={styles.title}>Login</Heading>
        <TextInput
          placeholder={'Email'}
          style={styles.input}
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          placeholder={'Password'}
          style={styles.input}
          secureTextEntry
          onChangeText={(password) => this.setState({password})}
        />
        <Button styleName="secondary" style={styles.button} onPress={this.login.bind(this)}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Button>
      </KeyboardAvoidingView>
    );
  }
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5ECEF',
  },
  title: {
    marginBottom: 35,
  },
  input: {
    width: '80%',
    marginBottom: 15
  },
  button: {
    marginTop: 20,
    width: '80%',
    paddingTop: 15,
    paddingBottom: 15,
  },
  buttonText: {
    color: 'white'
  }
});
