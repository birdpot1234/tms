import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

import { Container, Content, Separator } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../functions/normalize';
import { Empty } from '../../comp/FlatList';

class ProfileTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDetailBill_A: [],
      showinvoicebill_A: []
    }
  }

  componentDidMount = () => {
    this.detailsummoney();
    this.checkinvoicebill();
  }

  detailsummoney = () => {
    this.props.client.query({
      query: DTblacklist,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ showDetailBill_A: result.data.DTblacklist })
    }).catch((err) => {
      console.log(err)
    });
  }

  checkinvoicebill = () => {
    this.props.client.query({
      query: blacklist,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({ showinvoicebill_A: result.data.blacklist })
    }).catch((err) => {
      console.log(err)
    });
  }

  render() {
    return (
      <Container>
        <Content >
          <View>
            {
              this.state.showinvoicebill_A.length > 0 ?
                this.state.showinvoicebill_A.map((val, i) => (
                  <View key={`blacklist${i}`}>
                    <Separator bordered>
                      <Text style={styles.storeLabel}>{" "}{val.CustomerName}</Text>
                    </Separator>
                    <View>
                      {
                        this.state.showDetailBill_A.map((el, k) => {
                          return this.renderBlackList(el, val, k)
                        })
                      }
                    </View>
                  </View>
                )) : <Empty title={'ไม่มีรายการลูกค้า'} />
            }
          </View>
        </Content>
      </Container>
    );
  }

  renderBlackList(el, val, k) {
    if (el.CustomerID == val.CustomerID) {
      return (
        <View style={styles.detailContent} key={`detail${k}`}>
          <View style={{ backgroundColor: 'white', paddingLeft: 0 }}>
            <View style={{ paddingLeft: normalize(5), flexDirection: 'row' }}>
              <Text style={{ fontSize: normalize(16) }} >{el.invoiceNumber}</Text>
            </View>
          </View>
        </View>
      )
    }
  }
}

export default withApollo(ProfileTab)


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
    fontSize: normalize(18),
    color: 'black'
  },
  detailContent: {
    marginLeft: normalize(5)
  }
})
