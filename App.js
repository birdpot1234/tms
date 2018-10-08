import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  StatusBar
} from 'react-native'
import { StackNavigator } from "react-navigation";
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'
import { Root } from 'native-base';

import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import mainScreen from "./components/mainScreen";

import mainService from "./components/services/mainService";


const networkInterface = createNetworkInterface({
  uri: 'http://www.dplus-system.com:3009/api/graphql'
})

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: r => r.id,
})

export default class App extends React.Component {

  state = {
    loaded: false
  }

  constructor() {
    super();
    mainService.load(v => this.setState({ loaded: true }));

  }

  renderSection = () => {
    return <AppStackNavigator />;
  }

  renderLoad = () => {
    return (
      <ImageBackground style={styles.container}
        source={require('./assets/loader.png')}>
        <Image source={require('./assets/dplus.png')}
          style={{ width: 160, height: 160 }} />
      </ImageBackground>
    );
  }

  render() {
    return (

      <ApolloProvider client={client}>
        <Root>
          <StatusBar backgroundColor="#33adff"
            barStyle="light-content" hidden={false} />
          {this.state.loaded ? this.renderSection() : this.renderLoad()}
        </Root>
      </ApolloProvider>
    );
  }
}

const AppStackNavigator = StackNavigator({
  Login: {
    screen: Login
  },
  ForgetPassword: {
    screen: ForgetPassword
  },
  mainScreen: {
    screen: mainScreen
  },
},
  {
    initialRouteName: 'Login',
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
