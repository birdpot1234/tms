import React, { Component } from 'react'
import { Text, StyleSheet, View,TouchableOpacity,Dimensions,TouchableHighlight,Modal } from 'react-native'

import {Icon,Container,Header,Footer,Left,Body,Title,Right,Button, Content} from 'native-base';

class testpag extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
  
       
    }
 
    //console.log('8879787848156115184161351568456846146136')
}


// setModalVisible(visible) {
//   this.setState({modalVisible: visible});
// }




static navigationOptions = {
    header: null
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
          {/* <TouchableOpacity onPress={() =>  { navigate('AutoSearch')}}>}>
          <Footer style={{
            backgroundColor: '#ff6c00',
            justifyContent: 'center',
            alignItems: 'center'
          }} >

            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ส่งงาน</Text>


          </Footer>
        </TouchableOpacity> */}
    
        </Container>
    );
  }

  
}
export default testpag;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    
})
