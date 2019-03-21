import React, { Component } from 'react'
//import { Text, StyleSheet, View } from 'react-native'

//import {Icon,Container,Header,Left,Body,Title,Right,Button} from 'native-base';
import { Text, StyleSheet, View, Dimensions, RefreshControl, FlatList, CheckBox, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Tab, Tabs, TabHeading, Button, Subtitle, ListItem, Content, Badge, Accordion, Footer, ActionSheet } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../../functions/normalize';
import { Empty } from '../../comp/FlatList'
import font from '../../resource/font';
class LikesTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_rep: [],
      show_res: [],
      refreshing_2: false,
      loading: false
    }
  }

  componentDidMount = () => {
    this.reportsuccesswork(); // work
    this.reportspecial(); // special
  }

  _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2: true });
    this.reportsuccesswork();
    this.reportspecial();
  }

  reportsuccesswork = () => {
    this.props.client.query({
      query: reportsuccesswork,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({
        show_rep: result.data.reportsuccesswork,
        loading: true,
        refreshing_2: false
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  reportspecial = () => {
    this.props.client.query({
      query: reportspecial,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      this.setState({
        show_res: result.data.reportspecial,
      })
    }).catch((err) => {
      console.log(err)
    });
  }

  render() {
    let { loading } = this.state
    const { navigate } = this.props.navigation
    return (
      <Container>
        <Tabs locked>
          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}>
            <Icon name="md-cart" style={{ fontSize: normalize(24) }} />
            <Text style={{ color: 'white', fontSize: normalize(18) }}>  ประวัติงาน</Text>
          </TabHeading>}>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }
            >
              {loading ?
                <FlatList
                  data={this.state.show_rep}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => this.renderHistoryWork(item, index)}
                  ListEmptyComponent={<Empty title={'ไม่มีประวัติการส่งงาน'} />}
                /> : <View />}
            </Content >
          </Tab >

          {/* *********************************************************************** TAB specail JOB************************************************************************ */}
          < Tab heading={< TabHeading style={{ backgroundColor: '#66c2ff' }}>
            <Icon name="md-cart" style={{ fontSize: normalize(24) }} />
            <Text style={{ color: 'white', fontSize: normalize(18) }}>  ประวัติงานพิเศษ</Text>
          </TabHeading >}>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing_2}
                  onRefresh={this._RELOAD_MAIN2}
                />
              }
            >
              {loading ?
                <FlatList
                  data={this.state.show_res}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => this.renderHistorySpecial(item, index)}
                  ListEmptyComponent={<Empty title={'ไม่มีประวัติการส่งงานพิเศษ'} />}
                /> : <View />}
            </Content>
          </Tab >
        </Tabs >
      </Container >
    );
  }

  renderHistoryWork = (item, index) => {
    const { navigate } = this.props.navigation
    return <ListItem style={{ paddingTop: normalize(5), marginLeft: -normalize(0), paddingHorizontal: normalize(8), marginTop: 0 }} key={`Like${index}`}>
      <View>
        <Text style={{ fontSize: normalize(18), fontFamily: font.semi, color: 'black' }}>{item.INVOICEID}</Text>
        <Text style={{ fontSize: normalize(16) }}>{item.CustomerName}</Text>
      </View>
      <View style={{ position: 'absolute', right: normalize(8), top: normalize(7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: normalize(16), color: 'orange', paddingHorizontal: normalize(10) }}>{item.SUM} ฿ </Text>
        {
          (() => {
            if (item.Status == "A1") {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                  <Badge success style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <Button transparent
                      onPress={() => navigate('History', { id: item.INVOICEID, Zone: item.Zone, address: item.AddressShipment, Cusname: item.CustomerName, refresion: this._RELOAD_MAIN2, datetime: item.Datetime })}
                    >
                      <Text style={{ fontSize: normalize(14), color: 'white' }}>ส่งสำเร็จ</Text>
                    </Button>

                  </Badge>
                </View>
              )
            } else if (item.Status == "A2") {
              return (

                <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                  <Badge warning style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <Button transparent
                      onPress={() => navigate('History', { id: item.INVOICEID, Zone: item.Zone, address: item.AddressShipment, Cusname: item.CustomerName, refresion: this._RELOAD_MAIN2, datetime: item.Datetime })}
                    >
                      <Text style={{ fontSize: normalize(14), color: 'white' }}>มีการแก้ไข</Text>
                    </Button>

                  </Badge>
                </View>

              )
            } else {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                  <Badge style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <Button transparent
                      onPress={() => navigate('History', { id: item.INVOICEID, Zone: item.Zone, address: item.AddressShipment, Cusname: item.CustomerName, refresion: this._RELOAD_MAIN2, datetime: item.Datetime })}
                    >
                      <Text style={{ fontSize: normalize(14), color: 'white' }}>ส่งไม่สำเร็จ</Text>
                    </Button>
                  </Badge>
                </View>
              )
            }
          })()
        }
      </View>
    </ListItem>
  }

  renderHistorySpecial = (item, index) => {
    return <ListItem style={{ paddingTop: normalize(5), marginLeft: -normalize(0), paddingHorizontal: normalize(8), marginTop: 0 }} key={`Special${index}`}>
      <View>
        <Text style={{ fontSize: normalize(18), fontFamily: font.semi, color: 'black' }}>{item.tsc_document}</Text>
        <Text style={{ fontSize: normalize(16) }}>{item.customerName}</Text>
      </View>
      <View style={{ position: 'absolute', right: normalize(8), top: normalize(7), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {
          (() => {
            if (item.Status == "A1") {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                  <Badge success style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: normalize(14), color: 'white' }}>ส่งสำเร็จ</Text>
                  </Badge>
                </View>
              )
            } else if (item.Status == "A2") {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                  <Badge warning style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: normalize(14), color: 'white' }}>มีการแก้ไข</Text>
                  </Badge>
                </View>
              )
            } else {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center', }} >
                  <Badge style={{ height: normalize(19), alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: normalize(14), color: 'white' }}>ส่งไม่สำเร็จ</Text>
                  </Badge>
                </View>
              )
            }
          })()
        }
      </View>
    </ListItem>
  }
}

const GraphQL = compose(LikesTab)
export default withApollo(GraphQL)


const sucesswork = gql`
  query sucesswork($MessengerID:String!){
            sucesswork(MessengerID: $MessengerID){
            invoiceNumber
          status
          DELIVERYNAME
          SUM
      }
  }
`
const reportsuccesswork = gql`
  query reportsuccesswork($MessengerID:String!){
    reportsuccesswork(MessengerID: $MessengerID){
      INVOICEID
      Status
      CustomerName
      SUM
      Datetime
      Zone
      AddressShipment
      }
  }
`
const reportspecial = gql`
  query reportspecial($MessengerID:String!){
    reportspecial(MessengerID: $MessengerID){
      tsc_document
      status_finish
      customerName
      
      }
  }
`
const worksub = gql`
    query worksub($MessengerID:String!){
            worksub(MessengerID: $MessengerID){
            invoiceNumber
            customerName
          DELIVERYNAME
          Zone
          addressShipment
          SUM
      }
  }
`

const queryZONE = gql`
  query queryZONE($MessengerID:String!){
            queryZONE(MessengerID: $MessengerID){
            Zone
          }
          }
        `


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
