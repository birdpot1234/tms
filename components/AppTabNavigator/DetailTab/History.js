import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import Moment from 'moment';

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

class History extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            showDetailWork: [],
            latitude: null,
            longitude: null,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
        }
        this.props.client.resetStore();
        this.subDetail();
        this.summoneydetail();
        this.submitedit();
    }

    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
        this.subDetail();
        this.summoneydetail();
        this.submitedit();
    }

    _RELOAD_TO_GOBACK = () => {
        this.props.navigation.state.params.refresion()
        this.props.navigation.goBack()
    }

    subDetail = () => {
        this.props.client.query({
            query: subDetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                showDetailWork: result.data.subDetail
            })
            // console.log( result.data.subDetail)
        }).catch((err) => {
            console.log(err)
        });
    }

    submitwork = (s) => {
        this.props.client.mutate({
            mutation: submitwork,
            variables: {
                "status": s,
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.submiitdetail(s)
        }).catch((err) => {
            console.log("err of submitwork", err)
        });
    }

    submiitdetail = (s) => {
        this.props.client.mutate({
            mutation: submiitdetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("wokeeey");
                    console.log(position);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                    }, () => this.tracking(s, 1));
                },
                (error) => this.setState({ error: error.message }),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
            );
        }).catch((err) => {
            console.log("err of submiitdetail", err)
        });
    }
    summoneydetail = () => {
        this.props.client.query({
            query: summoneydetail,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({
                ShowMomey: result.data.summoneydetail
            })
            // console.log(this.state.ShowSUM)
        }).catch((err) => {
            console.log(err)
        });
    }
    telCustomer = () => {
        this.props.client.query({
            query: telCustomer,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTel: result.data.telCustomer[0].telCustomer
            }, () => {
                Communications.phonecall(this.state.showTel, true)
            })

            // console.log( result.data.telCustomer)
        }).catch((err) => {
            console.log(err)
        });
    }
    tracking = (s, n) => {
        console.log("tracking")

        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            if (n == 1) {
                this.props.navigation.state.params.refresion()
                this.props.navigation.goBack()
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
                            onPress={() => { navigate('Like') }}>
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
                        <Text>วันที่ : {Moment(this.props.navigation.state.params.datetime).format('l')} {Moment(this.props.navigation.state.params.datetime).format('LTS')} </Text>
                    </View>

                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>

                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ชื่อ</Text>
                        </View>

                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>จำนวน</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>ราคา</Text>

                        </View>

                    </View>

                    <View>
                        {
                            this.state.showDetailWork.map((l, i) => (
                                <View style={{ flexDirection: 'row' }}>

                                    <View style={{ width: Dimensions.get('window').width / 2 }}>
                                        <Text style={{ paddingLeft: 5 }}>{i + 1}). {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>{l.qty - l.qtyCN}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', right: 5 }}>
                                        <Text style={{ fontWeight: 'bold', color: 'orange', right: 5, alignSelf: 'flex-end' }}>{l.amountedit} ฿</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                    <View style={{ borderTopWidth: 0.5, borderTopColor: 'gray', left: 10 }}>
                        {
                            this.state.ShowMomey.map((l, i) => (
                                <View style={{ marginTop: 20 }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>ราคาทั้งหมด : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'orange', fontWeight: 'bold', fontSize: 17 }}> {l.SUM} ฿</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 5, justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>หมายเหตุ :  </Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

                    <View style={{ left: 10, marginTop: 10 }}>
                        {
                            (() => {
                                if (this.state.statusEdit == 1) {
                                    return (
                                        <Badge warning style={{ alignItems: 'center', justifyContent: 'center' }} >
                                            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>***บิลนี้มีการแก้ไข***</Text>
                                        </Badge>
                                    )
                                }
                            })()
                        }
                    </View>

                </Content>
            </Container>

        )

    }
}

const GraphQL = compose(History)
export default withApollo(GraphQL)

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