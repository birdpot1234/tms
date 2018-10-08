import React, { Component } from 'react'
import { Text, StyleSheet, View,TouchableOpacity,Dimensions,TouchableHighlight,Modal } from 'react-native'

import {Icon,Container,Header,Left,Body,Title,Right,Button, Content} from 'native-base';

class ProfileTab extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
        showTable: [],
        showTableGreen: [],
        refreshing_1: false,
        latitude: null,
        longitude: null,
        error: null,
        CF_ALL_INVOICE: [],
        stack_IVOICE: [],
        status_CHECKBOX: false,
        modalVisible: false,

       
    }
    // this.props.client.resetStore();
    //this.checkwork();
    //this.worklist_query();
  //  this.getPay();
    console.log('8879787848156115184161351568456846146136')
}
// getPay = async () => {
    
//   const res = await fetch(`http://localhost:3400/orders`);
//   const data = await res.json();
//   console.log(data)
//   console.log('9999999999999999999999999999777777777777777777777777777778888888888888888888888')

//       // this.setState({
//       //     TyroABC: data.response ? data.response[0].VIA_BTC_ABC: '',
      
//       //  })
//       //  console.log('ssss');

// }
 getMoviesFromApiAsync() {
  return fetch('http://www.dplus-system.com:3400/orders')
    .then((response) => response.json())
    .then((responseJson) => {
    console.log('1111')
    })
    .catch((error) => {
      console.error(error);
    });
}
setModalVisible(visible) {
  this.setState({modalVisible: visible});
}

geti(){
 return fetch('http://www.dplus-system.com:3401/products', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'eiei',
    price: '500',
  }),
}).then((response) => response.json())
    .then((responseJson) => {
      console.log('eiei')
    })
    .catch((error) => {
      console.error(error);
    });

}


    static navigationOptions = {
        tabBarLabel: "ข่าว",
        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-list-box" style={{ color:
            tintColor }} />
        )
    }
    
  render() {
    const { navigate } = this.props.navigation
    return (
        
        <Container>
       <Header >
       <Left>
       <Button transparent
       onPress={() => {navigate("MainMenu")}}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
            <Body>
              <Title>ข่าวสาร</Title>
            </Body>
            <Right />
          </Header>
    
          {/* <Swipeout right={swipeBtns}
        autoClose='true'
        backgroundColor= 'transparent'>
        <TouchableHighlight
          underlayColor='rgba(192,192,192,1,0.6)'
          onPress={this.viewNote.bind(this, rowData)} >
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.note}> {rowData} </Text>
            </View>
            <Separator />
          </View>
        </TouchableHighlight>
      </Swipeout> */}
      
         
        </Container>
    );
  }

  
}
export default ProfileTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    
})
