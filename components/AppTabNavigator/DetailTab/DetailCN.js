import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
var BUTTONS = [
    { text: "admin คลังไม่อยู่", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
    // { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
    // { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
    // { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
    // { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
    // { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
    // { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var CANCEL_INDEX = 1;

class DetailCN extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            showINV: [],
            showDetailWork: [],
            latitude: 1,
            longitude: 1,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
        }
        this.props.client.resetStore();
  
     //   this.submitedit();

    }
  

    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
        this.subDetail();
      
        this.submitedit();
    }

    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }

    submitwork = (s) => {
        this.props.client.mutate({
            mutation: submit_TSC,
            variables: {
                "TSC": this.props.navigation.state.params.id,
                "status_work": s
               
            }
        }).then((result) => {
            console.log(result.data.submit_TSC.status)
            if(!result.data.submit_TSC.status)
            {
                Alert.alert(
                    "ส่งไม่สำเร็จ",
                    "กรุณากดส่งใหม่อีกครั้ง",
                )
            }
            else{
                this.tracking(s,1)
            }
           // this.submiitdetail(s)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

 
    tracking = (s, n) => {
        console.log("tracking")

        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            if (n == 1) {
                console.log('tracking',result.data.tracking_CN.status)
                if(!result.data.tracking_CN.status)
                {
                    Alert.alert(
                        "ส่งไม่สำเร็จ",
                        "กรุณากดส่งใหม่อีกครั้ง",
                    )
                }
                else{
                    this.props.navigation.state.params.refresion()
                    this.props.navigation.goBack()
                }
             
            }
            else if (n == 2) {

                this.telCustomer();

            }
            else {
                console.log("Tracking ", result.data.tracking.status)
            }
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    submitedit = () => {
        this.props.client.query({
            query: submitedit,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
            }
        }).then((result) => {
            if (result.data.submitedit.status) {
                this.setState({
                    statusEdit: 1
                })
            } else {
                this.setState({
                    statusEdit: 0
                })
            }

        }).catch((err) => {
            console.log("err of submitedit", err)
        });
    }

    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => { navigate('AddMediaTab') }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>รายละเอียด</Title>
                    </Body>
                    <Right />
                </Header>

                 <Content>

                    <View style={{ margin: 10 }}>

                        <Text>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                        <Text >ห้าง : {this.props.navigation.state.params.Zone} </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>
                        <Text>ที่อยู่ : {this.props.navigation.state.params.address} </Text>
                        <Text>ชื่อผู้ส่งงาน : {global.NameOfMess}</Text>
                      
                        
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17,  }}>รายละเอียด</Text>

                    </View>
                    <View style={styles.textAreaContainer } >
                        <Text
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder="Type something"
                            placeholderTextColor="grey"
                            numberOfLines={10}
                            multiline={true}
                        > {this.props.navigation.state.params.detail_cn}</Text>
                    </View>
                   

                </Content> 
          

             
             {/* <TouchableOpacity onPress={() =>  { navigate('Submit_TSC',{ id: this.props.navigation.state.params.id,refresion: this._RELOAD_TO_GOBACK})}}>
        
              <Footer style={{
                backgroundColor: '#ff6c00',
                justifyContent: 'center',
                alignItems: 'center'
              }} >

                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ส่งงาน</Text>


              </Footer>
            </TouchableOpacity> */}

                 <TouchableOpacity
                            onPress={() =>
                                Alert.alert(
                                    "ยืนยันการส่งงาน",
                                    "คุณต้องการยืนยัน การส่งงาน -สำเร็จ- หรือ -ไม่สำเร็จ- ?",
                                    [
                                        {
                                            text: "ไม่", onPress: () =>
                                                ActionSheet.show(
                                                    {
                                                        options: BUTTONS,
                                                        cancelButtonIndex: CANCEL_INDEX,
                                                        title: "รายงานการส่ง"
                                                    },
                                                    buttonIndex => {
                                                        this.submitwork(BUTTONS[buttonIndex].status)
                                                    }
                                                )
                                        },
                                        { text: "ใช่", onPress: () => navigate("Submit_TSC", { id: this.props.navigation.state.params.id, refresion: this._RELOAD_TO_GOBACK }) }
                                    ]
                                )
                            }
                        >
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >

                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ส่งงาน</Text>


              </Footer>
                        </TouchableOpacity>
            </Container>

        )

    }
}

const GraphQL = compose(DetailCN)
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
    }
  })
const subDetail = gql`
    query subDetail($invoiceNumber:String!){
        subDetail(invoiceNumber: $invoiceNumber){
            invoiceNumber
            itemCode
            itemName
            qty
            qtyCN
            amountedit
            priceOfUnit
            amountbox
            Note
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
const submit_TSC = gql`
    mutation submit_TSC($TSC:String!,$status_work:String!){
        submit_TSC(TSC: $TSC,status_work: $status_work){
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

const tracking_CN = gql`
    mutation tracking_CN(
        $invoice:String!,
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!
    ){
        tracking_CN(
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