import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity,Keyboard } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge,Textarea } from 'native-base';
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

class CNDetail extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            // showINV: [],
            // showDetailWork: [],
            // latitude: 1,
            // longitude: 1,
            // error: null,
            // ShowMomey: [],
            // showTel: "",
            // statusEdit: 0,
            Amount_CN:null,
            docCN:"",
        }
        this.props.client.resetStore();
        this.CNDetail();
     //   this.submitedit();

    }
  

    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
    //    this.subDetail();
      
      //  this.submitedit();
    }

    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }

    insertCN = (invoice,docCN) => {
        this.props.client.mutate({
            mutation: Insert_CNJob,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "Amount":this.state.Amount_CN,
                "CNDoc": this.state.docCN,
                "MessNo":global.NameOfMess
               
            }
        }).then((result) => {
            console.log(result.data.Insert_CNJob.status)
            if(!result.data.Insert_CNJob.status)
            {
                Alert.alert(
                    "ส่งไม่สำเร็จ",
                    "กรุณากดส่งใหม่อีกครั้ง",
                )
            }
            else{
               // this.tracking(s,1)
               this.props.navigation.state.params.refresion()
               this.props.navigation.goBack()
            }
           // this.submiitdetail(s)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }


    CNDetail = () => {
        this.props.client.query({
            query: CNJob,
            variables: {
                "Invoice": this.props.navigation.state.params.id,
            }
        }).then((result) => {
         
            
                this.setState({
                    Amount_CN: result.data.CNJob[0].Amount,
                    docCN:result.data.CNJob[0].CNDoc,
                    
                    
                })
            

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
                            onPress={() =>  { navigate('Search') }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>ทำรายการส่วนลด</Title>
                    </Body>
                    <Right />
                </Header>

                 <Content>
                 <View style={{ margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black',fontWeight: 'bold', fontSize: 17 }}>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                    </View>

                    <View style={{ margin: 10 }}>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ paddingLeft: 5,fontWeight: 'bold', fontSize: 17 }}>มูลค่าส่วนลดรวม</Text>
                            </View>
                           
                            <Item style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Input keyboardType='numeric'
                                    placeholder="0"
                                    placeholderTextColor="gray"
                                    underlineColorAndroid='white'
                                    value={this.state.Amount_CN}
                                    //value = {this.state.testset}
                                    onChangeText={
                                        (text) => {
                                            if(parseInt(text) < 0)
                                            {
                                                Alert.alert(
                                                    "ข้อมูลที่ใส่ไม่ถูกต้อง",
                                                    "ไม่สามารถใส่จำนวนติดลบได้",
                                                    [
                                                        // { text: "ยืนยัน", onPress: () => this.saveSign() }
                                                        { text: "ยืนยัน", onPress: () => 
                                                        this.setState({
                                                            Amount_CN: 0
                                                            
                                                            
                                                        })
                                                    
                                                    }
                                                    ]
                                                )

                                            }else{
                                                this.setState({
                                                    Amount_CN: text
                                                    
                                                    
                                                })
                                            }
                                          

                                        }
                                    } />
                            </Item>
                        </View>
                      
                        
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17, }}>รายละเอียด</Text>


                    </View>


                    <Textarea style={{ height: 150, margin: 20, padding: 10, borderColor: 'gray', borderWidth: 1 }}
                        rowSpan={5}
                        bordered
                       // placeholder={this.state.docCN}
                        maxLength={255}
                        value={this.state.docCN}
                        //keyboardType='default'
                        returnKeyType='done'
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(text) => this.setState({ docCN: text })}
                    />
         
                   

                </Content> 
          
                  
         <TouchableOpacity onPress={() =>        Alert.alert(
                            "ยืนยันการแก้ไข",
                            "โปรดตรวจสอบรายการก่อนการยืนยัน",
                            [
                                { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                                // { text: "ยืนยัน", onPress: () => this.saveSign() }
                                { text: "ยืนยัน", onPress: () => this.insertCN() }
                            ]
                        ) }>
          <Footer style={{
            backgroundColor: '#ff6c00',
            justifyContent: 'center',
            alignItems: 'center'
          }} >

            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>บันทึก</Text>


          </Footer>
        </TouchableOpacity>
            </Container>

        )

    }
}

const GraphQL = compose(CNDetail)
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




const CNJob = gql`
    query CNJob($Invoice:String!){
        CNJob(Invoice: $Invoice){
            invoiceNumber
            Amount
            CNDoc
        }
    }
`
const Insert_CNJob = gql`
    mutation Insert_CNJob($invoice:String!,$Amount:String!,$CNDoc:String!,$MessNo:String!){
        Insert_CNJob(invoice: $invoice,Amount: $Amount,CNDoc: $CNDoc,MessNo: $MessNo){
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

