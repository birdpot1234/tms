import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView } from 'react-native'

import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Separator, ListItem } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'

class ProfileTab extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      showDetailBill_A: [],
      showinvoicebill_A: []
    }
   // this.props.client.resetStore();
    this.detailsummoney();
    this.checkinvoicebill();
  }

  detailsummoney = () => {
    console.log("detailsummoney")

    this.props.client.query({
      query: DTblacklist,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.DTblacklist)
      this.setState({
        showDetailBill_A: result.data.DTblacklist
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  checkinvoicebill = () => {
    console.log("queryZone")

    this.props.client.query({
      query: blacklist,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.blacklist)
      this.setState({
        showinvoicebill_A: result.data.blacklist
      })
    }).catch((err) => {
      console.log(err)
    });
  }


    // static navigationOptions = {
    //     tabBarLabel: "BlackList",
    //     tabBarIcon: ({ tintColor }) => (
    //         <Icon name="ios-list-box" style={{ color:
    //         tintColor }} />
    //     )
    // }
    
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
              <Title>รายชื่อลูกค้าไม่โอนเงินตามกำหนด</Title>
            </Body>
            <Right />
          </Header>
          
          <Content >
          <View>
            {
              this.state.showinvoicebill_A.map(val => (
                <View>
                  <Separator bordered>
                    <Text style={styles.storeLabel}>{" "}{val.CustomerName}</Text>
                  </Separator>

                  <View>
                    {
                      this.state.showDetailBill_A.map(l => {
                        if (l.CustomerID == val.CustomerID) {
                          return (
                            <View style={styles.detailContent}>
                              <View style={{ backgroundColor: 'white',paddingLeft: 0 }}>
                                {/* <View style={{  justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5  }}> */}
                                  <View style={{paddingLeft:5, flexDirection: 'row' }}>
                                    <Text style={{fontSize:14}} >{l.invoiceNumber}</Text>
                                  </View>
                                 
                              
                                {/* </View> */}
                              </View>
                            </View>

                          )
                        }
                      })
                    }
                  </View>
                </View>


              )
              )
            }

          </View>
         
         
               

            </Content>
     
         
        </Container>
    );
  }

  
}
const GraphQL = compose(ProfileTab)
export default withApollo(ProfileTab)


const detailsummoney = gql`
query detailsummoney($MessengerID:String!){
  detailsummoney(MessengerID: $MessengerID){
    invoiceNumber
    qty
    amount
    itemName
    
  }
}
`
const checkinvoicebill = gql`
  query checkinvoicebill($MessengerID:String!){
    checkinvoicebill(MessengerID: $MessengerID){
      invoiceNumber
      }
  }
`
const DTblacklist = gql`
query DTblacklist($MessengerID:String!){
  DTblacklist(MessengerID: $MessengerID){
    CustomerID
    CustomerName
    MessNO
    enableCredit
    invoiceNumber
  }
}
`
const blacklist = gql`
query blacklist($MessengerID:String!){
  blacklist(MessengerID: $MessengerID){
    CustomerID
    CustomerName
    MessNO
    enableCredit
    
  }
}
`
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  storeLabel: {
    fontSize: 18,
    color: 'black'
  },
  detailContent: {
    marginLeft:5
  }
})
