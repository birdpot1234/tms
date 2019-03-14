import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert, StatusBar, Dimensions } from 'react-native'
import { TabRouter, addNavigationHelpers, createNavigator, NavigationActions } from 'react-navigation'
import { Icon, Container, Header, Left, Body, Right, Content, Button, Form, Item, Label, Input, Title } from 'native-base'
import { gql, withApollo, compose } from 'react-apollo'

class MainMenu extends Component {

     static navigationOptions = {
         header: null
     }
    
    // static navigationOptions = {
    //     header: null,
    //     tabBarLabel: "เมนู",
    //     tabBarIcon: ({ tintColor }) => (
    //         <Icon name="ios-folder-open" style={{ color:
    //         tintColor }} />
    //     )
    // }

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
        global.NameOfMess = "";
        this.props.client.resetStore();
        this.user();
    }

    // GET_LOCATE() {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log("wokeeey");
    //             console.log(position);
    //             this.setState({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,
    //                 error: null,
    //             });
    //         },
    //         (error) => this.setState({ error: error.message }),
    //         { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    //     );
    // }

    // _reset = () => {
    //     this.props.client.resetStore();
    //     this.user();
    // }

    user = () => {
        console.log('user')
        navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log("wokeeey");
                        console.log(position);
                      
                    },
                    (error) => this.setState({ error: error.message }),
                    { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
                );
            
   
        const IMEI = require('react-native-imei');

        this.props.client.query({
            query: beforeloginQuery,
            variables: {
                "imei": IMEI.getImei()
            }
        }).then((result) => {
            // console.log(result.data.beforeloginQuery[0].IDMess)
            this.setState({ mess: result.data.beforeloginQuery[0].IDMess })
            console.log(IMEI.getImei())
        }).catch((err) => {
            console.log(err)
        });
    }
    
    checkwork2 = () => {
      
        const { navigate } = this.props.navigation
        console.log('checkwork222222222222222222222222222222222222222222222222222222')
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
                navigate('Home');
                
            }
          
           
             console.log("8888888888888881111111111111111111111111111999999999999999999"+result.data.selectpendingwork)

        }).catch((err) => {
            console.log(err)
        });
       
    }
    checkroundout = () => {

        this.props.client.resetStore();

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
                        { text: 'กลับไปตรวจงาน', onPress: () => {this.checkwork2()}},
                        {
                            text: 'ตกลง', onPress: () => {
                                // this.setState({
                                //              latitude: null,
                                //             longitude: null,
                                //             error: null,
                                //         })
                                this.Trackingstatus5();    
                                // navigator.geolocation.getCurrentPosition(
                                //     (position) => {
                                //         console.log("wokeeey");
                                //         console.log(position);
                                //         this.setState({
                                //             latitude: position.coords.latitude,
                                //             longitude: position.coords.longitude,
                                //             error: null,
                                //         }, () => this.Trackingstatus5());
                                //     },
                                //     (error) => this.setState({ error: error.message }),
                                //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
                                // );
                            }
                        },
                    ]
                )
            } else if (result.data.checkroundout.status == 2) {
                Alert.alert(
                    'ยืนยันการออกรอบ',
                    'คุณต้องการออกรอบเลยหรือไม่?',
                    [
                        { text: 'ยกเลิก', onPress: () => console.log("no") },
                        {
                            text: 'ยืนยัน', onPress: () => {
                            //     this.setState({
                            //         latitude: null,
                            //        longitude: null,
                            //        error: null,
                            //    })
                                 this.Trackingstatus5();    
                                // navigator.geolocation.getCurrentPosition(
                                //     (position) => {
                                //         console.log("wokeeey");
                                //         console.log(position);
                                //         this.setState({
                                //             latitude: position.coords.latitude,
                                //             longitude: position.coords.longitude,
                                //             error: null,
                                //         }, () => this.Trackingstatus5());
                                //     },
                                //     (error) => this.setState({ error: error.message }),
                                //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
                                // );
                            }
                        },
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
        }).then((result) => {
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
            // console.log("checkinvoice", result.data.checkinvoice)
            this.setState({ showINVOICE_ID: result.data.checkinvoice })
            // console.log("NUM", this.state.showINVOICE_ID.length)
            if (n == 1) {
                if (this.state.showINVOICE_ID.length > 0) {
                //    this.billTOapp(n);
                   navigate('HomeTab');
                } else {
                    navigate('HomeTab');
                }
            } else if (n == 2) {
                // if (this.state.showINVOICE_ID.length > 0) {
                //     this.billTOapp(n);
                // } else {
                //     this.checkroundout();
                // }
                this.checkroundout();
            }
        }).catch((err) => {
            console.log("err of checkinvoice", err)
        });
    }

    billTOapp = (n) => {
        const { navigate } = this.props.navigation
        console.log("billTOapp")
        this.props.client.mutate({
            mutation: billTOapp,
            variables: {
                "MessengerID": global.NameOfMess
            }

        }).then((result) => {
           
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
    detailtoapp_v2 =() =>{
           
        this.props.client.mutate({
            mutation: billTOappDetail_new,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.state.showINVOICE_ID.map(l => {
                //this.detailtoapp(l.INVOICEID);
                this.tracking(l.INVOICEID, "4", global.NameOfMess, this.state.latitude, this.state.longitude);
            });
           
           console.log("success")
        }).catch((err) => {
            console.log("error", err)
        });
    }

    detailtoapp = (id) => {
        console.log("detailtoapp")
      
        this.props.client.mutate({
            mutation: detailtoapp,
            variables: {
                "INVOICEID": id
            }
        }).then((result) => {
            this.tracking(id, "4", global.NameOfMess, this.state.latitude, this.state.longitude);
           console.log("success")
        }).catch((err) => {
            console.log("error", err)
        });
    }

    tracking = (invoice, status, messID, lat, long) => {
        console.log("tracking")

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
        console.log("Trackingstatus5")

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
        console.log('checkworkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk------------------------------')
        const { navigate } = this.props.navigation

        this.props.client.query({
            query: selectpendingwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            // this.setState({
            //     showTable: result.data.querywork
            // }).
            //result.data.selectpendingwork.status =false
            console.log(result.data.selectpendingwork.status)
            if(result.data.selectpendingwork.status){
                Alert.alert(
                    'คุณยังมีงานที่ยังค้างการส่ง',
                    'คุณต้องการเคลียงานเก่า?',
                    [
    
                    
                        { text: 'ใช่', onPress: () => navigate("Search") },
                    ]
                )
                navigate("Search")
            }
            else{
             this.checkinvoice(1);
                
            }
          
           
             console.log("8888888888888881111111111111111111111111111999999999999999999"+result.data.selectpendingwork)

        }).catch((err) => {
            console.log(err)
        });
       
    }
    _PRESS_HOME = (n) => {
        if(n==1)
        {
            this.checkwork();
        }else{
            this.checkinvoice(n);
        }
        

    }

    render() {

        const { navigate } = this.props.navigation

        global.NameOfMess = this.state.mess

        return (

            <Container style={{ backgroundColor: 'white' }}>

                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Image source={require('../assets/dplus.png')}
                            style={{ width: 40, height: 40 }} />
                    </View>
                </Header>

                <Content style={{ backgroundColor: 'white' }}>
                    <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: "center",
                            alignItems: 'center',
                            borderRadius: 20,
                            width: Dimensions.get('window').width / 1.1,
                            height: Dimensions.get('window').height / 4.5,
                            backgroundColor: '#66c9ff',
                            elevation: 10,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Image source={require('../assets/user.png')}
                                    style={{ width: Dimensions.get('window').width / 3.5, height: Dimensions.get('window').width / 3.5 }}
                                />
                                <View style={{ flexDirection: 'column', width: Dimensions.get('window').width / 2, height: Dimensions.get('window').width / 3.5, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ width: Dimensions.get('window').width / 2.5 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 25 }}>  You ID : </Text>
                                    </View>
                                    <View style={{ backgroundColor: 'white', borderRadius: 20, width: Dimensions.get('window').width / 2.5, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                        <Text style={{ color: '#66c2ff', fontWeight: 'bold', fontSize: 20 }}>{global.NameOfMess}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "center", paddingVertical: 5 }}>
                        <TouchableOpacity
                            onPress={() => navigate('LikesTab')}
                            style={{ paddingHorizontal: 5 }}>
                            <View style={{
                                width: Dimensions.get('window').width / 3, height: Dimensions.get('window').height / 3.8, backgroundColor: 'white',
                                justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderColor: '#0099CC', borderWidth: 3
                            }}>
                                <Image source={require('../assets/icon/history.png')}
                                    style={{ width: 100, height: 100 }} />
                                <Text style={{ marginTop: 20, fontSize: 20, color: '#0099CC' }}>ประวัติ</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this._PRESS_HOME(2)}//this.checkroundout()
                            style={{ paddingHorizontal: 5 }}>
                            <View style={{
                                width: Dimensions.get('window').width / 1.8, height: Dimensions.get('window').height / 3.8, backgroundColor: '#1e90ff',
                                justifyContent: 'center', alignItems: 'center', borderRadius: 20
                            }}>
                                <Image source={require('../assets/icon/motorbike.png')}
                                    style={{ width: 100, height: 100 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 20, color: 'white' }}>ส่งงาน</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "center", paddingVertical: 5 }}>
                        <TouchableOpacity
                            onPress={() => this._PRESS_HOME(1)}
                            style={{ paddingHorizontal: 10 }}>
                            <View style={{
                                width: Dimensions.get('window').width / 1.8, height: Dimensions.get('window').height / 3, backgroundColor: '#33adff',
                                justifyContent: 'center', alignItems: 'center', borderRadius: 20
                            }}>
                                <Image source={require('../assets/icon/checklist.png')}
                                    style={{ width: 100, height: 100 }} />
                                <Text style={{ fontWeight: 'bold', marginTop: 20, fontSize: 20, color: 'white' }}>ตรวจงาน</Text>
                            </View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => navigate('AddMediaTab')}
                                style={{ paddingHorizontal: 5 }}>
                                <View style={{
                                    width: Dimensions.get('window').width / 3, height: Dimensions.get('window').height / 6.3, backgroundColor: 'white',
                                    justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderColor: '#66CCFF', borderWidth: 3, marginBottom: 10
                                }}>
                                    <Image source={require('../assets/icon/shuffle.png')}
                                        style={{ width: 65, height: 65 }} />
                                    <Text style={{ marginTop: 3, fontSize: 20, color: '#0099CC' }}>งานพิเศษ</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigate('ProfileTab')}
                                style={{ paddingHorizontal: 5 }}>
                                <View style={{
                                    width: Dimensions.get('window').width / 3, height: Dimensions.get('window').height / 6.3, backgroundColor: 'white',
                                    justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderColor: '#0099CC', borderWidth: 3
                                }}>
                                    <Image source={require('../assets/icon/newspaper.png')}
                                        style={{ width: 65, height: 65 }} />
                                    <Text style={{ marginTop: 3, fontSize: 20, color: '#0099CC' }}>BlackList</Text>
                                </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#66c2ff',
        flexDirection: 'column'
    }
})
