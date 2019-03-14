import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import Moment from 'moment';

var CANCEL_INDEX = 4;

class ReciveWork extends Component {

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
        //this.datetime();
  
       // this.submitedit();

    }
    datetime=()=>{
        var strDate = this.props.navigation.state.params.receive_date
        var mydate = new Date(strDate)
        console.log("datetime",mydate.toLocaleString())
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
    checkpending = () => {
      
        const { navigate } = this.props.navigation
        
        this.props.client.query({
            query: selectpendingwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
       
            console.log(result.data.selectpendingwork.status)
            if(result.data.selectpendingwork.status){
                Alert.alert(
                    'คุณยังมีงานที่ยังค้างการส่งหรือยังไม่สรุปยอด',
                    'คุณต้องการเคลียงานเก่า?',
                    [
    
                    
                        { text: 'ใช่', onPress: () => navigate("Search") },
                    ]
                )
                navigate("Search")
            }
            else{
             
                    this.confirmworksome()
              
            }
          
        }).catch((err) => {
            console.log(err)
        });
       
    }
    confirmworksome = () => {
        // const { navigate } = this.props.navigation
        console.log("confirmworksome")

        this.props.client.mutate({
            mutation: receive_SC,
            variables: {
                "TSC": this.props.navigation.state.params.id
            }
        }).then((result) => {
            if (result.data.receive_SC.status) {
                this.tracking()
            } else {

                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานนี้ไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            }
        }).catch((err) => {
            console.log(err)
        });
    }

   

 
    tracking = () => {
        console.log("tracking")

        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": '5',
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
         
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
             
          
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    // submitedit = () => {
    //     this.props.client.query({
    //         query: submitedit,
    //         variables: {
    //             "invoiceNumber": this.props.navigation.state.params.id,
    //         }
    //     }).then((result) => {
    //         if (result.data.submitedit.status) {
    //             this.setState({
    //                 statusEdit: 1
    //             })
    //         } else {
    //             this.setState({
    //                 statusEdit: 0
    //             })
    //         }

    //     }).catch((err) => {
    //         console.log("err of submitedit", err)
    //     });
    // }

    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => { navigate('Home') }}>
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
                         <Text>ผู้ของาน :{this.props.navigation.state.params.receive_from}   โทร:{this.props.navigation.state.params.user_request_tel}</Text>
                        <Text>รับของจาก : {this.props.navigation.state.params.receive_from}  โทร:{this.props.navigation.state.params.send_tel}</Text> 
                        <Text>วันที่รับของ : {this.props.navigation.state.params.receive_date}</Text> 
                        <Text>ไปส่งของที่่ : {this.props.navigation.state.params.send_to}</Text> 
                        <Text>วันที่ไปส่งของ : {this.props.navigation.state.params.send_date}</Text> 
                        <Text>ประเภทงาน : {this.props.navigation.state.params.task_group} {this.props.navigation.state.params.task_group_document}  {this.props.navigation.state.params.task_group_quantity}</Text> 
                        {/* <Text >ห้าง : {this.props.navigation.state.params.Zone} </Text>
                         <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>
                         <Text>ที่อยู่ : {this.props.navigation.state.params.address} </Text>
                        <Text>ชื่อผู้ส่งงาน : {global.NameOfMess} </Text>
                        <Text>วันที่ : 16/10/2018</Text> */}
                        
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
                        > {this.props.navigation.state.params.comment}</Text>
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

            <TouchableOpacity onPress={
                    () => Alert.alert(
                        'ตรวจงานนี้',
                        'คุณต้องการยืนยันการตรวจงานนี้?',
                        [
                            { text: 'ไม่', onPress: () => console.log("no") },
                            { text: 'ใช่', onPress: () => this.checkpending() },
                        ]
                    )
                }>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >

                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ยืนยันการตรวจงาน</Text>


                    </Footer>
                </TouchableOpacity>
            </Container>

        )

    }
}

const GraphQL = compose(ReciveWork)
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

 const selectpendingwork = gql`
        query selectpendingwork($MessengerID:String!){
            selectpendingwork(MessengerID: $MessengerID){
                    status
               }
                }
            `
const receive_SC = gql`
        mutation receive_SC($TSC:String!){
                receive_SC(TSC: $TSC){
                        status
                   }
                    }
                `