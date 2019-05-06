import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native'
import { Container, Header, Content } from 'native-base'
import IMEI from 'react-native-imei';
import { gql, withApollo, compose } from 'react-apollo'
import { normalize } from '../functions/normalize';
import font from '../resource/font';

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mess: "",
            showStatus: [],
            showINVOICE_ID: [],
            latitude: 1,
            longitude: 1,
            error: null,
        };
        // this.props.client.resetStore();
        this.user();
    }

    user = () => {
        if (!global.NameOfMess) {
            this.props.client.query({
                query: beforeloginQuery,
                variables: {
                    "imei": IMEI.getImei()
                    // "imei": "359993095666890",
                }
            }).then((result) => {
                global.NameOfMess = result.data.beforeloginQuery[0].IDMess;
                this.setState({ mess: result.data.beforeloginQuery[0].IDMess })
            }).catch((err) => {
                console.log(err)
            });
        }
    }

    checkwork2 = () => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: selectpendingwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data.selectpendingwork.status)
            if (result.data.selectpendingwork.status) {
                Alert.alert(
                    'คุณยังมีงานที่ยังค้างการส่งหรือยังไม่สรุปยอด',
                    'คุณต้องการเคลียงานเก่า?',
                    [
                        { text: 'ใช่', onPress: () => navigate("Search") },
                    ]
                )
            }
            else {
                navigate('Home');
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    checkroundout = () => {
        // this.props.client.resetStore();
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: checkroundout,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            // console.log(result.data.checkroundout.status)
            if (result.data.checkroundout.status == 1) {
                Alert.alert(
                    'คุณยังมีรายการที่ยังไม่ได้ตรวจ',
                    'ต้องการออกรอบเลยหรือไม่',
                    [
                        { text: 'ยกเลิก', onPress: () => console.log("no") },
                        { text: 'กลับไปตรวจงาน', onPress: () => { this.checkwork2() } },
                        { text: 'ตกลง', onPress: () => { this.Trackingstatus5(); } },
                    ]
                )
            } else if (result.data.checkroundout.status == 2) {
                Alert.alert(
                    'ยืนยันการออกรอบ',
                    'คุณต้องการออกรอบเลยหรือไม่?',
                    [
                        { text: 'ยกเลิก', onPress: () => console.log("no") },
                        { text: 'ยืนยัน', onPress: () => { this.Trackingstatus5(); } },
                    ]
                )
            } else {
                navigate("Search")
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    roundout = () => {
        const { navigate } = this.props.navigation
        this.props.client.mutate({
            mutation: roundout,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then(() => {
            navigate('Search')
        }).catch((err) => {
            console.log("error", err)
        });
    }

    checkinvoice = (n) => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: checkinvoice,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            if (n == 1) {
                if (this.state.showINVOICE_ID.length > 0) {
                    this.setState({ showINVOICE_ID: result.data.checkinvoice }, () => this.billTOapp(n))
                } else {
                    navigate('HomeTab');
                }
            } else if (n == 2) {
                this.checkroundout();
            }
        }).catch((err) => {
            console.log("err of checkinvoice", err)
        });
    }

    billTOapp = (n) => {
        const { navigate } = this.props.navigation
        this.props.client.mutate({
            mutation: billTOapp,
            variables: {
                "MessengerID": global.NameOfMess
            }

        }).then(() => {
            this.detailtoapp_v2()
            if (n == 1) {
                navigate('HomeTab');
            } else if (n == 2) {
                this.checkroundout();
            }
        }).catch((err) => {
            console.log("error of billTOapp", err)
        });
    }

    detailtoapp_v2 = () => {
        this.props.client.mutate({
            mutation: billTOappDetail_new,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then(() => {
            this.state.showINVOICE_ID.map(l => {
                this.tracking(l.INVOICEID, "4", global.NameOfMess, this.state.latitude, this.state.longitude);
            });
        }).catch((err) => {
            console.log("error", err)
        });
    }

    detailtoapp = (id) => {
        this.props.client.mutate({
            mutation: detailtoapp,
            variables: {
                "INVOICEID": id
            }
        }).then(() => {
            this.tracking(id, "4", global.NameOfMess, this.state.latitude, this.state.longitude);
            console.log("success")
        }).catch((err) => {
            console.log("error", err)
        });
    }

    tracking = (invoice, status, messID, lat, long) => {
        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": invoice,
                "status": status,
                "messengerID": messID,
                "lat": lat,
                "long": long,
            }
        }).then((result) => {
            console.log("Tracking ", result.data.tracking.status)
        }).catch((err) => {
            console.log(err)
        });
    }

    Trackingstatus5 = () => {
        this.props.client.mutate({
            mutation: Trackingstatus5,
            variables: {
                "status": "6",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            console.log("Result of Trackingstatus5", result.data.Trackingstatus5)
            this.roundout()
        }).catch((err) => {
            console.log("ERR OF Trackingstatus5", err)
        });
    }

    checkwork = () => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: selectpendingwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            if (result.data.selectpendingwork.status) {
                Alert.alert(
                    'คุณยังมีงานที่ยังค้างการส่ง',
                    'คุณต้องการเคลียงานเก่า?',
                    [{ text: 'ใช่', onPress: () => navigate("Search") }]
                )
            }
            else {
                this.checkinvoice(1);
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    _PRESS_HOME = (n) => {
        if (n == 1) {
            this.checkwork();
        } else {
            this.checkinvoice(n);
        }
    }

    render() {
        let { mess } = this.state
        const { navigate } = this.props.navigation
        return (

            <Container style={{ backgroundColor: 'white' }}>

                <Content style={{ backgroundColor: 'white', paddingHorizontal: normalize(10) }}>
                    <StatusBar backgroundColor={"transparent"} translucent barStyle="light-content" />
                    <View style={{
                        marginVertical: normalize(6), justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#66c9ff',
                        elevation: 10, borderRadius: Math.floor(normalize(20)), height: Dimensions.get('window').height / 4.5,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image source={require('../assets/user.png')}
                                style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 3.5 }}
                            />
                            {mess ? <View style={{ flexDirection: 'column', width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 3.5, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: Dimensions.get('window').width / 2.5 }}>
                                    <Text style={{ color: 'white', fontFamily: font.bold, fontSize: normalize(25) }}>Your ID: </Text>
                                </View>
                                <View style={{ backgroundColor: 'white', borderRadius: Math.floor(normalize(20)), width: Dimensions.get('window').width / 2.5, justifyContent: 'center', alignItems: 'center', marginTop: normalize(4) }}>
                                    <Text style={{ color: '#66c2ff', fontFamily: font.bold, fontSize: normalize(22) }}>{global.NameOfMess}</Text>
                                </View>

                            </View> : <View style={{ width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 3.5, }} />}
                        </View>
                    </View>

                    {/* ประวัติ ส่งงาน */}
                    <View style={{ flexDirection: 'row', justifyContent: "center", paddingVertical: normalize(5), flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => navigate('LikesTab')}
                            style={{
                                paddingHorizontal: normalize(5), height: Dimensions.get('window').height / 3.8,
                                justifyContent: 'center', alignItems: 'center', borderRadius: Math.floor(normalize(20)), borderColor: '#0099CC', borderWidth: Math.floor(normalize(3)), flex: 1
                            }}>
                            <Image source={require('../assets/icon/history.png')} style={{ width: normalize(100), height: normalize(100) }} resizeMode={'contain'} />
                            <Text style={{ marginTop: normalize(5), fontSize: normalize(20), color: '#0099CC', fontFamily: font.semi }}>ประวัติ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this._PRESS_HOME(2)}//this.checkroundout()
                            style={{ flex: 2, backgroundColor: '#1e90ff', justifyContent: 'center', alignItems: 'center', borderRadius: Math.floor(normalize(20)), marginLeft: normalize(10) }}>
                            <Image source={require('../assets/icon/motorbike.png')} style={{ width: normalize(100), height: normalize(100) }} resizeMode={'contain'} />
                            <Text style={{ fontFamily: font.semi, marginTop: normalize(5), fontSize: normalize(20), color: 'white' }}>ส่งงาน</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "center", paddingVertical: normalize(5), flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => this._PRESS_HOME(1)}
                            style={{ paddingHorizontal: normalize(10), flex: 1, backgroundColor: '#33adff', justifyContent: 'center', alignItems: 'center', borderRadius: Math.floor(normalize(20)) }}>
                            <Image source={require('../assets/icon/checklist.png')} style={{ width: normalize(100), height: normalize(100) }} resizeMode={'contain'} />
                            <Text style={{ marginTop: normalize(5), fontSize: normalize(20), color: 'white', fontFamily: font.semi }}>ตรวจงาน</Text>
                        </TouchableOpacity>

                        <View style={{ flex: 1, marginLeft: normalize(10) }}>
                            <TouchableOpacity onPress={() => navigate('AddMediaTab')}
                                style={{ // AddMediaTab Email
                                    paddingHorizontal: normalize(5), justifyContent: 'center', alignItems: 'center', borderRadius: Math.floor(normalize(20)), borderColor: '#66CCFF',
                                    borderWidth: Math.floor(normalize(3)), marginBottom: normalize(10), height: Dimensions.get('window').height / 6.3,
                                }}>
                                <Image source={require('../assets/icon/shuffle.png')} style={{ width: normalize(55), height: normalize(55) }} resizeMode={'contain'} />
                                <Text style={{ fontSize: normalize(20), color: '#0099CC' }}>งานพิเศษ</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigate('ProfileTab')}
                                style={{
                                    paddingHorizontal: normalize(5), justifyContent: 'center', alignItems: 'center', borderRadius: Math.floor(normalize(20)), borderColor: '#0099CC',
                                    borderWidth: Math.floor(normalize(3)), height: Dimensions.get('window').height / 6.3,
                                }}>
                                <Image source={require('../assets/icon/newspaper.png')} style={{ width: normalize(55), height: normalize(55) }} resizeMode={'contain'} />
                                <Text style={{ fontSize: normalize(20), color: '#0099CC' }}>BlackList</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Content>
            </Container>

        )
    }
}

const GraphQL = compose(MainMenu)
export default withApollo(GraphQL)

const beforeloginQuery = gql`
    query beforeloginQuery($imei:String!){
        beforeloginQuery(imei: $imei){
            IDMess
        }
    }
`


const checkroundout = gql`
    query checkroundout($MessengerID:String!){
        checkroundout(MessengerID: $MessengerID){
            status
        }
    }
`

const roundout = gql`
    mutation roundout($MessengerID:String!){
        roundout(MessengerID: $MessengerID){
            status
        }
    }
`

const billTOapp = gql`
    mutation billTOapp($MessengerID:String!){
        billTOapp(MessengerID: $MessengerID){
            status
        }
    }
`

const detailtoapp = gql`
    mutation detailtoapp($INVOICEID:String!){
        detailtoapp(INVOICEID: $INVOICEID){
            status
        }
    }
`
const billTOappDetail_new = gql`
    mutation billTOappDetail_new($MessengerID:String!){
        billTOappDetail_new(MessengerID: $MessengerID){
            status
        }
    }
`


const checkinvoice = gql`
    query checkinvoice($MessengerID:String!){
        checkinvoice(MessengerID: $MessengerID){
            INVOICEID
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

const Trackingstatus5 = gql`
    mutation Trackingstatus5(
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!
    ){
        Trackingstatus5(
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


