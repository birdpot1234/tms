import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { gql, withApollo, compose } from 'react-apollo'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, Input, Item, Grid, Col, ActionSheet, Badge } from 'native-base';
import Communications from 'react-native-communications';
import buttomcustomer from '../testComponent/customButton'
import customButton from '../testComponent/customButton';
import Geocoder from 'react-native-geocoding';
import { normalize } from '../../../functions/normalize';
import font from '../../../resource/font';
var BUTTONS = [
    { text: "ลูกค้ากดผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B1" },
    { text: "ร้านปิด", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B2" },
    { text: "Order ซ้ำ", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B3" },
    { text: "สินค้าผิด", icon: "md-arrow-dropright", iconColor: "#fa213b", status: "B4" },
    { text: "เซลล์ key ผิด", icon: "md-arrow-dropright", iconColor: "#2c8ef4", status: "B5" },
    { text: "ลูกค้าสั่งร้านอื่นมาแล้ว", icon: "md-arrow-dropright", iconColor: "#f42ced", status: "B6" },
    { text: "เซลล์บอกราคาลูกค้าผิด", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B7" },

    { text: "ลูกค้าไม่โอนเงิน", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B8" },
    { text: "ลูกค้าไม่มีเงินจ่าย", icon: "md-arrow-dropright", iconColor: "#ea943b", status: "B9" },

    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];

class DetailWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetailWork: [],
            latitude: 1,
            longitude: 1,
            error: null,
            ShowMomey: [],
            showTel: "",
            statusEdit: 0,
            BUTTONS: [],
            CANCEL_INDEX: null,
            Amount_CNZ: 0,
            SumAmount: 0,
            load: false,
        }
    }

    componentDidMount = () => {
        this.subDetail();
        this.summoneydetail();
        this.submitedit();

        this.AmountCN();
        this.CN_Price();
    }


    _RELOAD_DETAILWORK = () => {
        this.props.client.resetStore();
        this.subDetail();
        this.summoneydetail();
        this.submitedit();
        this.AmountCN();
        this.CN_Price();
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
            this.setState({ showDetailWork: result.data.subDetail })
        }).catch((err) => {
            console.log(err)
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
        }).catch((err) => {
            console.log(err)
        });
    }


    submitwork = (s) => {
        if (s == 'B8' || s == 'B9') {
            this.props.client.mutate({
                mutation: Blacklist,
                variables: {
                    "status": s,
                    "invoice": this.props.navigation.state.params.id,
                    "messengerID": global.NameOfMess
                }
            }).then((result) => {
                console.log(result.data.Blacklist.status)
            }).catch((err) => {
                console.log("err of submitwork", err)
            });
        }

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
        }).then(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let { latitude, longitude } = position.coords
                    this.tracking(s, 1, latitude, longitude)
                },
                (error) => {
                    console.log(error)
                    this.tracking(s, 1, -1, -1)
                }
            );
        }).catch((err) => {
            console.log("err of submiitdetail", err)
        });
    }

    AmountCN = () => {
        this.props.client.query({
            query: AmountCN,
            variables: {
                "Invoice": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({ SumAmount: result.data.AmountCN[0].Sum_Amount })
        }).catch((err) => {
            console.log(err)
        });
    }

    CN_Price = () => {
        this.props.client.query({
            query: CN_Price,
            variables: {
                "Invoice": this.props.navigation.state.params.id
            }
        }).then((result) => {
            this.setState({ Amount_CNZ: result.data.CN_Price[0].Amount_CN })
        }).catch((err) => {
            console.log(err)
        });
    }

    tracking = (s, n, latitude, longitude) => {
        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": this.props.navigation.state.params.id,
                "status": s,
                "messengerID": global.NameOfMess,
                "lat": latitude,
                "long": longitude,
            }
        }).then(() => {
            if (n == 1) {
                this.props.navigation.state.params.refresion()
                this.props.navigation.goBack()
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
            this.setState({
                statusEdit: result.data.submitedit.status ? 1 : 0
            })
        }).catch((err) => {
            console.log("err of submitedit", err)
        });
    }

    checkfordel = () => {
        this.props.client.query({
            query: countinv_DL,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "MessengerID": global.NameOfMess,
            }
        }).then((result) => {
            if (result.data.countinv_DL[0].count_inv > 1) {
                this.delinvoice()
            } else {
                Alert.alert(
                    "ไม่สามารถลบได้",
                    "ลบไม่ได้เนื่องจากบิลนี้มีเพียง " + result.data.countinv_DL[0].count_inv + " บิล",
                    [
                        { text: "OK", onPress: () => console.log('') }
                    ]
                )
            }
        }).catch((err) => {
            console.log("err of submitedit", err)
        });
    }

    delinvoice = () => {
        this.props.client.mutate({
            mutation: delinvoice,
            variables: {
                "invoiceNumber": this.props.navigation.state.params.id,
                "id": this.props.navigation.state.params.index,
            }
        }).then(() => {
            this.props.navigation.state.params.refresion()
            this.props.navigation.goBack()
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }

    getToken(address) {
        return fetch('http://dplus-system.com:3499/tms/api/token')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.res.status.status_desc[0].APIKey);
                this.getMap(address, responseJson.res.status.status_desc[0].APIKey)
            })
            .catch((error) => {
                Alert.alert("กรุณาลองใหม่อีกครั้ง", "", [{ text: "รับทราบ", onPress: () => this.errorMap() }])
            });
    }

    getMap = (address, apiKey) => {
        Geocoder.init(apiKey); // use a valid API key
        Geocoder.from(address)
            .then(json => {
                var location = json.results[0].geometry.location;
                Linking.openURL('geo:37.7749,-122.4194?q=' + location.lat + ',' + location.lng + ' ')
            })
            .catch(error =>
                Alert.alert("ที่อยู่จัดส่งไม่ชัดเจน", "กรุณาแจ้ง IT ตรวจสอบ", [{ text: "รับทราบ", onPress: () => this.errorMap() }])
            )
    }

    onConfirm = async () => {
        try {
            let { customerID, Cusname } = this.props.navigation.state.params
            const { navigate } = this.props.navigation
            navigate("SubmitJob", {
                id: this.props.navigation.state.params.id,
                refresion: this._RELOAD_TO_GOBACK,
                PAYMMODE: this.props.navigation.state.params.PAYMMODE,
                customerID,
                Cusname,
            })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <Container>
                <Content>
                    <View style={{ margin: normalize(10) }}>
                        <Text style={{ fontFamily: font.semi, color: 'black', fontSize: normalize(17) }}>รหัสบิล: {this.props.navigation.state.params.id}</Text>
                        <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ห้าง : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.Zone}</Text></Text>
                        <Text style={{ fontFamily: font.semi, fontSize: normalize(17), color: '#4682b4' }}>ชื่อลูกค้า : {this.props.navigation.state.params.Cusname} </Text>

                        <TouchableOpacity onPress={() => this.getToken(this.props.navigation.state.params.address)}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium, color: '#4682b4' }}>ที่อยู่ : <Text style={{ fontFamily: font.light }}>{this.props.navigation.state.params.address} </Text>
                                <Icon name='md-locate' style={{ color: "red", fontSize: normalize(24) }} />
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                        <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ชื่อ</Text>
                        </View>

                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>จำนวน</Text>
                        </View>
                        <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: normalize(17), fontFamily: font.medium }}>ราคา</Text>
                        </View>
                    </View>

                    <View>
                        {
                            this.state.showDetailWork.map((l, i) => (
                                <View style={{ flexDirection: 'row', paddingTop: normalize(3), paddingBottom: i === 0 ? 0 : normalize(3) }} key={i}>
                                    <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center' }}>
                                        <Text style={{ paddingLeft: normalize(16), fontSize: normalize(16), fontFamily: font.medium }}>{i + 1}). {l.itemName}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: normalize(16), fontFamily: font.medium }}>{l.qty - l.qtyCN}</Text>
                                    </View>
                                    <View style={{ width: Dimensions.get('window').width / 4, justifyContent: 'center', right: normalize(16) }}>
                                        <Text style={{ fontFamily: font.medium, fontSize: normalize(16), color: 'orange', alignSelf: 'flex-end' }}>{l.amountedit} ฿</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

                    <View style={{ borderTopWidth: 0.5, borderTopColor: 'gray', marginBottom: normalize(25), marginLeft: normalize(10), }}>
                        {
                            this.state.ShowMomey.map((l, i) => (
                                <View style={{ marginTop: normalize(25) }} key={`showMoney${i}`} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ color: 'orange', fontFamily: font.medium, fontSize: normalize(18) }}>ราคาทั้งหมด : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'orange', fontFamily: font.medium, fontSize: normalize(18) }}> {l.SUM} ฿</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontFamily: font.medium, fontSize: normalize(18), color: 'red' }}>ราคาส่วนลด : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: font.medium, fontSize: normalize(18), color: "red" }}> {this.state.Amount_CNZ} ฿</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: Dimensions.get('window').width / 3 }}>
                                            <Text style={{ fontFamily: font.medium, fontSize: normalize(18), color: "#229954" }}>ราคาสุทธิ : </Text>
                                        </View>
                                        <View style={{ width: Dimensions.get('window').width / 3, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: font.medium, fontSize: normalize(18), color: "#229954" }}>  {this.state.SumAmount} ฿</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>

                    {this.state.statusEdit == 1 && <View style={{ marginLeft: normalize(10), marginBottom: normalize(20) }}>
                        <Badge warning style={{ alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ fontSize: normalize(14), color: 'white', fontFamily: font.medium }}>***บิลนี้มีการแก้ไข***</Text>
                        </Badge>
                    </View>}
                </Content>

                <Footer style={{ height: normalize(140) }} backgroundColor={'white'}>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    "ยืนยันที่จะลบงานนี้ออก",
                                    "ลบงานเนื้องจากงานซ้ำหรือมียอดบิลไม่ตรง",
                                    [
                                        { text: "ไม่", onPress: () => console.log('NO') },
                                        { text: "ใช่", onPress: () => this.checkfordel() }
                                    ]
                                )
                            }}>
                                <View style={{
                                    width: Dimensions.get('window').width / 2,
                                    height: normalize(70), backgroundColor: '#FFBC66', justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Image source={require('../../../assets/icon/recyclebin.png')} style={{ width: normalize(35), height: normalize(35) }} />
                                    <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginTop: normalize(2) }}>ลบบิลเบิ้ล</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigate('EditItem', { id: this.props.navigation.state.params.id, refresion: this._RELOAD_DETAILWORK })} >
                                <View style={{
                                    width: Dimensions.get('window').width / 2,
                                    height: normalize(70), backgroundColor: '#FFFD66', justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Image source={require('../../../assets/icon/clam.png')}
                                        style={{ width: normalize(35), height: normalize(35) }} />
                                    <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginTop: normalize(2) }}>แก้ไขรายการ</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <TouchableOpacity onPress={() => navigate('CNDetail', { id: this.props.navigation.state.params.id, refresion: this._RELOAD_DETAILWORK })} >
                                <View style={{ width: Dimensions.get('window').width / 2, height: normalize(70), backgroundColor: '#66FFB3', justifyContent: 'center', alignItems: 'center' }} >
                                    <Image source={require('../../../assets/icon/check.png')}
                                        style={{ width: normalize(35), height: normalize(35) }} />
                                    <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginTop: normalize(2) }}>CN</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                        "ยืนยันการส่งงาน",
                                        "คุณต้องการยืนยัน การส่งงาน -สำเร็จ- หรือ -ไม่สำเร็จ- ?",
                                        [
                                            {
                                                text: "ไม่", onPress: () =>
                                                    ActionSheet.show({
                                                        options: BUTTONS,
                                                        title: "รายงานการส่ง",
                                                        itemStyle: { fontFamily: font.regular, fontSize: normalize(16), lineHeight: normalize(20) },
                                                        titleStyle: { fontFamily: font.semi, fontSize: normalize(18) }
                                                    }, (buttonIndex) => ((buttonIndex || buttonIndex === 0) && buttonIndex !== 9) && this.submitwork(BUTTONS[buttonIndex].status))
                                            },
                                            { text: "ใช่", onPress: () => this.onConfirm() }
                                        ]
                                    )}>
                                <View style={{ width: Dimensions.get('window').width / 2, height: normalize(70), backgroundColor: '#FFA566', justifyContent: 'center', alignItems: 'center' }} >
                                    <Image source={require('../../../assets/icon/file.png')}
                                        style={{ width: normalize(35), height: normalize(35) }} />
                                    <Text style={{ fontFamily: font.semi, fontSize: normalize(16), marginLeft: normalize(8) }}>ส่งงาน</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Footer>
            </Container>

        )

    }
}

const GraphQL = compose(DetailWork)

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
const countinv_DL = gql`
    query countinv_DL($invoiceNumber:String!,$MessengerID:String!){
        countinv_DL(invoiceNumber: $invoiceNumber,MessengerID: $MessengerID){
            count_inv
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

const AmountCN = gql`
    query AmountCN($Invoice:String!){
        AmountCN(Invoice: $Invoice){
            Sum_Amount
        }
    }
`
const CN_Price = gql`
    query CN_Price($Invoice:String!){
        CN_Price(Invoice: $Invoice){
            Amount_CN
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

const delinvoice = gql`
    mutation delinvoice($invoiceNumber:String!,$id:String!){
        delinvoice(invoiceNumber: $invoiceNumber,id:$id){
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
const Blacklist = gql`
          mutation Blacklist(
              $invoice:String!,
              $status:String!,
              $messengerID:String!
           
    ){
          Blacklist(
          invoice: $invoice,
          status: $status,
          messengerID: $messengerID
         ){
            status
          }
          }
      `
const reasonfail = gql`
    query reasonfail($MessengerID:String!){
      reasonfail(MessengerID: $MessengerID){
        
        text
        icon
        iconColor
        status
      }
  }
`