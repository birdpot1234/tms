import React, { Component } from 'react'
//import { Text, StyleSheet, View } from 'react-native'

//import {Icon,Container,Header,Left,Body,Title,Right,Button} from 'native-base';
import { Text, StyleSheet, View, Dimensions, RefreshControl, CheckBox, Alert, TouchableOpacity,ActivityIndicator } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Tab, Tabs, TabHeading, Button, Subtitle, ListItem, Content, Badge, Accordion, Footer, ActionSheet } from 'native-base';
import { gql, withApollo, compose } from 'react-apollo'

class LikesTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showWork: [],
      showZone: [],
      show_SUC: [],
      show_rep:[],
      refreshing_2: false,
      CF_ALL_INVOICE: [],
      stack_IVOICE: [],
      status_CHECKBOX: false,
      load:true,
    }
    // this.props.client.resetStore();
    this.queryZONE();
    this.worksub();
    this.sucesswork();
    this.reportsuccesswork();
  }

  _RELOAD_MAIN2 = () => {
    this.props.client.resetStore();
    this.setState({ refreshing_2: true });
   // this.queryZONE();
   // this.worksub();
    this.sucesswork();
   // this.setState({ CF_ALL_INVOICE: [], stack_IVOICE: [] })

   this.reportsuccesswork();
    this.setState({ refreshing_2: false });
  }
  worksub = () => {
    console.log('worksub')

    this.props.client.query({
      query: worksub,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log("workSub.................")
      console.log(result.data.worksub)
      this.setState({
        showWork: result.data.worksub
      })
    }).catch((err) => {
      console.log(err)
    });
  }
  queryZONE = () => {
    console.log("queryZone")

    this.props.client.query({
      query: queryZONE,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {
      console.log(result.data.queryZONE)
      this.setState({
        showZone: result.data.queryZONE
      })
    }).catch((err) => {
      console.log(err)
    });
  }
  sucesswork = () => {
    console.log("sucesswork eiei")
    console.log("5555555555555555555555555555555555555555555")
    this.props.client.query({
      query: sucesswork,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {

      console.log('HISTORYYYYYYYYY')
      console.log(result.data.sucesswork)
      this.setState({
        show_SUC: result.data.sucesswork
      })
    }).catch((err) => {
      console.log(err)
    });
  }
  reportsuccesswork = () => {
    console.log("reportsuccesswork eiei")
    console.log("5555555555555555555555555555555555555555555")
    this.props.client.query({
      query: reportsuccesswork,
      variables: {
        "MessengerID": global.NameOfMess
      }
    }).then((result) => {

      console.log('HISTORYYYYYYYYY55')
      console.log(result.data.reportsuccesswork.AddressShipment)
      console.log(result.data.reportsuccesswork)
      this.setState({
        show_rep: result.data.reportsuccesswork,
        load:false
      })
    }).catch((err) => {
      console.log(err)
    });
  }



    static navigationOptions = {
        tabBarLabel: "ประวัติ",
        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-folder-open" style={{ color:
            tintColor }} />
        )
    }

  render() {
    const { navigate } = this.props.navigation
    return (
        
        <Container>
        <Header style={{ backgroundColor: '#66c2ff' }}>
        <Left>
        <Button transparent
        onPress={() => {navigate("MainMenu")}}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
            <Body>
              <Title>ประวัติการส่งงาน</Title>
              
            </Body>
            <Right />
          </Header>
          <Content
              refreshControl={
                <RefreshControl
                 // refreshing={this.state.refreshing_2}
                 // onRefresh={this._RELOAD_MAIN2}
                />
              }
            >


     <View style={[styles.container, styles.horizontal]}>
             {
              
                 this.state.load ?
                     <ActivityIndicator size="small" color="#00ff00" />
                     :
                     

                    <View/>
                      
       
  
                   
             }
         </View>
   {
     
     this.state.show_rep.map(k => (
      <ListItem style={{ paddingTop: 5 }}>
        <View>
          <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
            <Text style={styles.storeLabel}>{k.INVOICEID}</Text>
          </View>
          <View style={{ paddingLeft: 0, flexDirection: 'row', paddingEnd: 0 }}>
            <Text style={{ fontSize: 12 }}>{k.CustomerName}</Text>
          </View>
        </View>
        <View style={{ position: 'absolute', right: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: 'orange', paddingHorizontal: 30 }}>{k.SUM} ฿ </Text>
          {
            (() => {
              if (k.Status == "A1") {
                return (
                  <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5 }} >
                    <Badge success style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                    <Button transparent
                             onPress={() => navigate('History', { id: k.INVOICEID, Zone:k.Zone, address: k.AddressShipment, Cusname:k.CustomerName, refresion: this._RELOAD_MAIN2,datetime:k.Datetime })}
                              >
                               <Text style={{ fontSize: 12, color: 'white' }}>ส่งสำเร็จ</Text>
                                {/* <Icon name='ios-arrow-forward' style={{ color: 'gray' }} /> */}
                              </Button>
                      
                    </Badge>
                  </View>
                )
              } else if (k.Status == "A2") {
                return (

                  <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5  }} >
                    <Badge warning style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >
                    <Button transparent
                               onPress={() => navigate('History', { id: k.INVOICEID, Zone:k.Zone, address: k.AddressShipment, Cusname:k.CustomerName, refresion: this._RELOAD_MAIN2,datetime:k.Datetime })}
                              >
                               <Text style={{ fontSize: 12, color: 'white' }}>มีการแก้ไข</Text>
                                {/* <Icon name='ios-arrow-forward' style={{ color: 'gray' }} /> */}
                              </Button>
                      
                    </Badge>
                  </View>

                )
              } else {
                return (
                  <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width / 5.5  }} >
                    <Badge style={{ height: 19, alignItems: 'center', justifyContent: 'center' }} >

             
                      <Button transparent
                                onPress={() => navigate('History', { id: k.INVOICEID, Zone:k.Zone, address: k.AddressShipment, Cusname:k.CustomerName, refresion: this._RELOAD_MAIN2,datetime:k.Datetime })}
                              >
                               <Text style={{ fontSize: 12, color: 'white' }}>ส่งไม่สำเร็จ</Text>
                                {/* <Icon name='ios-arrow-forward' style={{ color: 'gray' }} /> */}
                              </Button>
                    </Badge>
                  </View>
                )
              }
            })()
          }
        </View>
      </ListItem>
    ))
   }

          </Content>
        </Container>
    );
  }

  
}
const GraphQL = compose(LikesTab)
export default withApollo(GraphQL)
//export default LikesTab;


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
