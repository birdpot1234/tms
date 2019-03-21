import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  Image,
  StatusBar
} from 'react-native'
import font from './resource/font'
import GlobalFont from 'react-native-global-font'
import { normalize } from './functions/normalize'
import { createStackNavigator } from "react-navigation";
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'
import { Root } from 'native-base';

import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import mainScreen, { navigationOptions } from "./components/mainScreen";
import { HeaderBack, HeaderTitle } from './comp/Header'

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

  componentDidMount() {
    let fontName = font.regular
    GlobalFont.applyGlobal(fontName)
    Platform.OS === "android" && this.checkPermissionPhone()
  }


  async  checkPermissionPhone() {
    let permissions = [
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    ];
    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      let status = Object.values(granted).every(item => item === PermissionsAndroid.RESULTS.GRANTED)
      if (status) {
        mainService.load(v => this.setState({ loaded: true }));
      } else {
        this.checkPermissionPhone()
      }
    } catch (err) {
      console.warn(err);
    }
  }
  renderSection = () => {
    return <AppStackNavigator />;
  }

  renderLoad = () => {
    return (
      <ImageBackground style={styles.container}
        source={require('./assets/loader.png')}>
        <Image source={require('./assets/dplus.png')}
          style={{ width: normalize(160), height: normalize(160), borderRadius: 15, }} />
      </ImageBackground>
    );
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Root>
          <StatusBar backgroundColor={"transparent"} translucent barStyle="light-content" />
          {this.state.loaded ? this.renderSection() : this.renderLoad()}
        </Root>
      </ApolloProvider>
    );
  }
}

const AppStackNavigator = createStackNavigator({
  // Login: {
  //   screen: Login
  // },
  // ForgetPassword: {
  //   screen: ForgetPassword,
  //   navigationOptions: {
  //     ...navigationOptions,
  //     headerTitle: <HeaderTitle title={'ลืมรหัสผ่าน'} />,
  //     headerLeft: <HeaderBack />,
  //     headerRight: <View />
  //   }
  // },
  mainScreen: {
    screen: mainScreen
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
