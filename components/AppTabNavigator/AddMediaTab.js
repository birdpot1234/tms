import React, { Component } from 'react'
import { AppRegistry, Text, StyleSheet, StatusBar, Dimensions, View, CheckBox } from 'react-native'

import { Icon, Header, Container, Left, Body, Title, Right, Button, Content } from 'native-base';

class AddMediaTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // latitude: null,
      // longitude: null,
      // error: null,
    };
  }

  static navigationOptions = {
    tabBarLabel: "่เคลม",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="ios-construct" style={{
        color:
          tintColor
      }} />
    ),
  }

  // componentDidMount() {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       console.log("wokeeey");
  //       console.log(position);
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         error: null,
  //       });
  //     },
  //     (error) => this.setState({ error: error.message }),
  //     { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
  //   );
  // }

  render() {
    const { navigate } = this.props.navigation
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent
              onPress={() => { navigate("MainMenu") }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>เคลม</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            {/* <Switch /> */}
            <CheckBox
              value={true}
              onValueChange={() => {
                this.setState({ checked: !this.state.checked })
                console.log("CHECK BOX",!this.state.checked)
              }} />
            {/* <Text> {this.state.latitude} </Text>
            <Text> {this.state.longitude} </Text>
            <Text> {this.state.error} </Text> */}
          </View>
        </Content>
      </Container>
    );
  }


}
export default AddMediaTab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
