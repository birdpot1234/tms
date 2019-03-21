import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, Keyboard } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge, Textarea } from 'native-base';
import Communications from 'react-native-communications';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
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
    constructor(props) {
        super(props);
        this.state = {
            Amount_CN: null,
            docCN: "",
        }
    }

    componentDidMount = () => {
        this.CNDetail();
    }

    insertCN = (invoice, docCN) => {
        this.props.client.mutate({
            mutation: Insert_CNJob,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "Amount": this.state.Amount_CN,
                "CNDoc": this.state.docCN,
                "MessNo": global.NameOfMess

            }
        }).then((result) => {
            console.log(result.data.Insert_CNJob.status)
            if (!result.data.Insert_CNJob.status) {
                Alert.alert(
                    "ส่งไม่สำเร็จ",
                    "กรุณากดส่งใหม่อีกครั้ง",
                )
            }
            else {
                this.props.navigation.state.params.refresion()
                this.props.navigation.goBack()
            }
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
            if (result) {
                this.setState({
                    Amount_CN: result.data.CNJob[0].Amount,
                    docCN: result.data.CNJob[0].CNDoc,
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
                <Content>
                    <View style={{ margin: normalize(10) }}>
                        <Text style={{ fontFamily: font.semi, color: 'black', fontSize: normalize(17) }}>รหัสบิล : {this.props.navigation.state.params.id}</Text>
                    </View>

                    <View style={{ margin: normalize(10), paddingHorizontal: normalize(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: normalize(17), fontFamily: font.semi }}>มูลค่าส่วนลดรวม</Text>
                            </View>

                            <Item style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Input keyboardType='numeric'
                                    placeholder="0"
                                    placeholderTextColor="gray"
                                    underlineColorAndroid='white'
                                    value={this.state.Amount_CN}
                                    style={{
                                        textAlign: 'center', fontSize: normalize(17), fontFamily: font.medium,
                                        paddingBottom: 0, marginBottom: 0, paddingTop: 0, marginTop: 0,
                                    }}
                                    onChangeText={
                                        (text) => {
                                            if (parseInt(text) < 0) {
                                                Alert.alert(
                                                    "ข้อมูลที่ใส่ไม่ถูกต้อง",
                                                    "ไม่สามารถใส่จำนวนติดลบได้",
                                                    [
                                                        { text: "ยืนยัน", onPress: () => this.setState({ Amount_CN: 0 }) }
                                                    ]
                                                )
                                            } else {
                                                this.setState({
                                                    Amount_CN: text
                                                })
                                            }
                                        }
                                    } />
                            </Item>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: normalize(10) }}>
                        <Text style={{ fontSize: normalize(18), fontFamily: font.semi }}>รายละเอียด</Text>
                    </View>


                    <Textarea
                        style={{ height: normalize(150), margin: normalize(20), padding: normalize(10), borderColor: 'gray', borderWidth: 1 }}
                        rowSpan={5}
                        bordered
                        maxLength={255}
                        value={this.state.docCN}
                        returnKeyType='done'
                        onSubmitEditing={Keyboard.dismiss}
                        onChangeText={(text) => this.setState({ docCN: text })}
                    />
                </Content>


                <TouchableOpacity onPress={() => Alert.alert(
                    "ยืนยันการแก้ไข",
                    "โปรดตรวจสอบรายการก่อนการยืนยัน",
                    [
                        { text: "ยกเลิก", onPress: () => console.log("Cancle") },
                        { text: "ยืนยัน", onPress: () => this.insertCN() }
                    ]
                )}>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>บันทึก</Text>
                    </Footer>
                </TouchableOpacity>
            </Container>

        )

    }
}

const GraphQL = compose(CNDetail)
export default withApollo(GraphQL)
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

