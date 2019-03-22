import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView } from 'react-native'

import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Separator, ListItem } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../../functions/normalize'
import font from '../../../resource/font'

class DetailBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetailBill: [],
      showinvoicebill: [],
      loading: false
    }
  }

  componentDidMount = () => {
    this.detailsummoney();
    this.checkinvoicebill();
  }

  detailsummoney = () => {
    this.props.client.query({
      query: detailsummoney,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ showDetailBill: result.data.detailsummoney, loading: true })
    }).catch((err) => {
      console.log(err)
    });
  }

  checkinvoicebill = () => {
    this.props.client.query({
      query: checkinvoicebill,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ showinvoicebill: result.data.checkinvoicebill })
    }).catch((err) => {
      console.log(err)
    });
  }

  render() {
    let { loading } = this.state
    return (
      <Container style={{ backgroundColor: 'white' }}>
        {loading ? <Content>
          {
            this.state.showinvoicebill.map((val, i) => (
              <View key={`invoice${i}`} style={{ flex: 1 }}>
                <Separator bordered>
                  <Text style={styles.storeLabel}> {val.invoiceNumber}</Text>
                </Separator>

                <View>
                  {this.state.showDetailBill.length > 0 ?
                    this.state.showDetailBill.map((item, index) => {
                      if (item.invoiceNumber == val.invoiceNumber) {
                        return (
                          <View style={styles.detailContent} key={index}>
                            <Text style={{ flex: 2, fontSize: normalize(16), fontFamily: font.medium }}>{item.itemName}</Text>
                            <Text style={{ fontSize: normalize(16), fontFamily: font.medium }}>{item.qty} ชิ้น</Text>
                            <Text style={{ flex: 1, fontSize: normalize(16), fontFamily: font.medium, color: 'orange', textAlign: 'right' }}>{item.amount} ฿</Text>
                          </View>
                        )
                      }
                    })
                    : <Empty title={'ไม่มีรายละเอียดยอดเงิน'} />
                  }
                </View>
              </View>


            ))
          }
        </Content> : <View />}
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
    fontSize: normalize(18),
    color: 'black'
  },
  detailContent: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'white',
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(5),
    flexDirection: 'row', borderBottomColor: 'gray',
    paddingHorizontal: normalize(10)
  }
})