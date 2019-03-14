import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge,ListItem } from 'native-base';
import Communications from 'react-native-communications';
import CompleteFlatList from 'react-native-complete-flatlist';
var BUTTONS = [
    { text: "ลูกค้ากดผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
    { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
    { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
    { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
    { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
    { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
    { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var CANCEL_INDEX = 4;
const data = [
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Syah', status: 'Active', time: '9:14 PM', date: '1 Dec 2018' },
    { name: 'Izzat', status: 'Active', time: '8:15 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    { name: 'Fattah', status: 'Active', time: '8:10 PM', date: '1 Jan 2018' },
    {
      name: 'Muhyiddeen',
      status: 'Blocked',
      time: '10:10 PM',
      date: '9 Feb 2018',
    },
  ];
class SearchView extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            showINV: [],
            latitude: 1,
            longitude: 1,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
            searchTerm:"",
        }
        this.props.client.resetStore();
        this.log();
        this.headerSearch();

       // this.subDetail();
       // this.summoneydetail();
       // this.submitedit();
    }
    log = () => {
       console.log('Searchviewwwwwww')
    }
    log2 = (inv) => {
        console.log(inv)
     }
    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
       // this.subDetail();
      //  this.summoneydetail();
      //  this.submitedit();
    }

    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }
  
  
    headerSearch = () => {
        this.props.client.query({
            query: select_INV,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            if(result.data.select_INV.length==0)
            {
                this.setState({
                    showINV: []
                })
            }else{
                this.setState({
                    showINV: result.data.select_INV
                })
            }
           
             console.log( result.data.select_INV)
        }).catch((err) => {
            console.log(err)
        });
    }
    cell(data,index,item) {
        console.log('this is index number : '+index+':'+data.invoiceNumber+''+this.state.showINV[0].invoiceNumber+""+item)
        //console.log('this is index number : '+data.invoiceNumber)
        const { navigate } = this.props.navigation
    
            return(
                
                <ListItem style={{ paddingTop: 5 }}>

                <View  >
           
                <TouchableOpacity   onPress={() => console.log(index+""+item) }>
                  <View style={{ paddingLeft: 0, flexDirection: 'row' }}>
                 
                    <Text style={styles.storeLabel}>{data.invoiceNumber}</Text>
                
                  </View>
                  <View style={{ paddingLeft: 0, flexDirection: 'row', paddingEnd: 0 }}>
                    <Text style={{ fontSize: 12 }}>{data.customerName}</Text>
                  </View>
                    
                </TouchableOpacity>
                </View>
                <View style={{ position: 'absolute', right: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity    onPress={() => { navigate('AddCN',{id:this.state.showINV[index]}) }}>
                  <Text style={{ fontSize: 13, color: 'orange', paddingHorizontal: 30 }}>{data.Zone}  </Text>
                  </TouchableOpacity>
                 
                </View>
              </ListItem>
    
)

        
       
      
      }
      cellEmpty() {
      //  console.log('this is index number : '+index)
        const { navigate } = this.props.navigation
    
            return(
               
                <View style={{ alignItems: 'center', marginTop: 20, borderColor: 'gray', borderWidth: 0.5 }}>
                <Text>คุณไม่มีงานที่ต้องส่ง</Text>
                <Text> หรือ </Text>
                <Text>กรุณาลากลงเพื่อทำการรีโหลด</Text>
              </View>
             
)

        
       
      
      }
  
  
    render() {

        const { navigate } = this.props.navigation
        let { sContainer, sSearchBar, sTextItem } = styles;
        if(this.state.showINV.length >0){
            return(

                // <View style={{ alignItems: 'center', marginTop: 20, borderColor: 'gray', borderWidth: 0.5 }}>
                 <CompleteFlatList
                searchKey={['invoiceNumber', 'customerName', 'Zone']}
                highlightColor="yellow"
           
           //data={}
                data={this.state.showINV}
     
              
               // renderSeparator={null}
               renderSeparator={null}
               keyExtractor={(item, index) => index.toString()}
                 renderItem= {this.cell.bind(this)}
           />
            )
        }
        else{
            return (
           

                <CompleteFlatList
                searchKey={['invoiceNumber', 'customerName', 'Zone']}
                highlightColor="yellow"
           
           
                data={this.state.showINV}
                renderSeparator={null}
           
                renderItem= {this.cell.bind(this)}
              />
                  )
        }
    

    }
}


const GraphQL = compose(SearchView)
export default withApollo(GraphQL)
const styles = StyleSheet.create({
    textAreaContainer: {
      borderColor: 'gray',
      borderWidth: 1,
      padding: 5,
      margin :10
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start"
    },
    flatList: { height: "100%", width: "100%", backgroundColor: "transparent" }
  })
const select_INV = gql`
    query select_INV($MessengerID:String!){
        select_INV(MessengerID: $MessengerID){
            invoiceNumber
            customerID
            customerName
            addressShipment
            Zone
            DateUpdate
        }
    }
`
const summoneydetail = gql`
    query summoneydetail($invoiceNumber:String!){
        summoneydetail(invoiceNumber: $invoiceNumber){
            SUM
        }
    }
`
const telCustomer = gql`
    query telCustomer($invoiceNumber:String!, $MessengerID:String!){
        telCustomer(invoiceNumber: $invoiceNumber, MessengerID: $MessengerID){
            telCustomer
        }
    }
`
const submitwork = gql`
    mutation submitwork($status:String!, $invoiceNumber:String!){
        submitwork(status: $status, invoiceNumber: $invoiceNumber){
            status
        }
    }
`

const submiitdetail = gql`
    mutation submiitdetail($invoiceNumber:String!){
        submiitdetail(invoiceNumber: $invoiceNumber){
            status
        }
    }
`
const submitedit = gql`
    query submitedit($invoiceNumber:String!){
        submitedit(invoiceNumber: $invoiceNumber){
            status
        }
    }
`

const tracking = gql`
    mutation tracking(
        $invoice:String!,
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!
    ){
        tracking(
            invoice: $invoice,
            status: $status,
            messengerID: $messengerID,
            lat: $lat,
            long: $long
        ){
            status
        }
    }
`