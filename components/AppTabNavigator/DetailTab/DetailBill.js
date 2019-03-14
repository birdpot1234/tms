import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView } from 'react-native'

import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Separator, ListItem } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
class DetailBill extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDetailBill: [],
      showinvoicebill: []
    }
   // this.props.client.resetStore();
    this.detailsummoney();
    this.checkinvoicebill();
  }

  detailsummoney = () => {
    console.log("detailsummoney")

    this.props.client.query({
      query: detailsummoney,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.detailsummoney)
      this.setState({
        showDetailBill: result.data.detailsummoney
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  checkinvoicebill = () => {
    console.log("queryZone")

    this.props.client.query({
      query: checkinvoicebill,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.checkinvoicebill)
      this.setState({
        showinvoicebill: result.data.checkinvoicebill
      })
    }).catch((err) => {
      console.log(err)
    });
  }
  render() {

    const { navigate } = this.props.navigation

    return (

      <Container style={{ backgroundColor: 'white' }}>
        <Header style={{ backgroundColor: '#66c2ff' }}>
          <Left>
            <Button transparent
              onPress={() => navigate('SumBill')}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>รายละเอียดยอดเงิน</Title>
          </Body>
          <Right />
        </Header>

        <Content>

          <View>
            {
              this.state.showinvoicebill.map(val => (
                <View>
                  <Separator bordered>
                    <Text style={styles.storeLabel}>{" "}{val.invoiceNumber}</Text>
                  </Separator>

                  <View>
                    {
                      this.state.showDetailBill.map(l => {
                        if (l.invoiceNumber == val.invoiceNumber) {
                          return (
                            <View style={styles.detailContent}>
                              <View style={{ backgroundColor: 'white',paddingLeft: 0 }}>
                                <View style={{  justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5  }}>
                                  <View style={{paddingLeft:5, width: Dimensions.get('window').width / 2, alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{fontSize:12}} >{l.itemName}</Text>
                                  </View>
                                  <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{fontSize:12}}  >{l.qty}</Text>
                                    <Text style={{fontSize:12}} >ชิ้น</Text>
                                  </View>
                                  <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ color: 'orange', fontWeight: 'bold',fontSize:12 }} >{l.amount}</Text>
                                    <Text  style={{ color: 'orange', fontWeight: 'bold',fontSize:12 }}>฿</Text>
                                  </View>
                                </View>
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

    )

  }
}


const GraphQL = compose(DetailBill)
export default withApollo(GraphQL)

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
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    borderColor: 'white',
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  }
})