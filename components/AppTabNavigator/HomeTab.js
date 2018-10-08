import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, TouchableOpacity, RefreshControl, CheckBox,ActivityIndicator } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, List, ListItem, Item } from 'native-base';
// import { List, ListItem } from 'react-native-elements';
import { gql, withApollo, compose } from 'react-apollo'
import mainService from '../services/mainService'

console.disableYellowBox = true;

class HomeTab extends Component {

    static navigationOptions = {}

    constructor(props) {
        super(props);
        this.state = {
            showTable: [],
            showTableGreen: [],
            refreshing_1: false,
            latitude: 1,
            longitude: 1,
            error: null,
            CF_ALL_INVOICE: [],
            stack_IVOICE: [],
            status_CHECKBOX: false,
            load:true,
           
        }
        // this.props.client.resetStore();
        //this.checkwork();
        this.worklist_query();
        this.selectwork();
      //  mainService.load(v => this.setState({load:true}))
    }

    checkDATA = (e) => {
        return (e == null) || (e == false)
    }

    // checkwork = () => {
    //     console.log('checkworkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk------------------------------')
    //     const { navigate } = this.props.navigation

    //     this.props.client.query({
    //         query: selectpendingwork,
    //         variables: {
    //             "MessengerID": global.NameOfMess
    //         }
    //     }).then((result) => {
    //         // this.setState({
    //         //     showTable: result.data.querywork
    //         // }).
    //         //result.data.selectpendingwork.status =false
    //         console.log(result.data.selectpendingwork.status)
    //         if(result.data.selectpendingwork.status){
    //             Alert.alert(
    //                 'คุณยังมีงานที่ยังค้างการส่ง',
    //                 'คุณต้องการเคลียงานเก่า?',
    //                 [
    
                    
    //                     { text: 'ใช่', onPress: () => navigate("Search") },
    //                 ]
    //             )
    //             navigate("Search")
    //         }
          
           
    //          console.log("8888888888888881111111111111111111111111111999999999999999999"+result.data.selectpendingwork)

    //     }).catch((err) => {
    //         console.log(err)
    //     });
       
    // }
    checkpending = (selection) => {
      
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
                this.setState({
                    load: true
                })
                if(selection ==0)
                {
                    console.log("000000000000000000000000000000000000000")
                    this.GET_LOCATE()
                    
                }
                else{
                    console.log("111111111111111111111111111111111111111")

                    this.checkinvoice()
                }
              
                
            }
          
           
             console.log("8888888888888881111111111111111111111111111999999999999999999"+result.data.selectpendingwork)

        }).catch((err) => {
            console.log(err)
        });
       
    }
    GET_LOCATE = () => {
        // console.log("componentDidMount")
        this.setState({
            latitude: 1,
            longitude: 1,
            error: null,
        }, () => {
            this.state.CF_ALL_INVOICE.map((val, i) => {
                if ((val == true) && ((i + 1) != this.state.CF_ALL_INVOICE.length)) {
                    this.tracking(this.state.stack_IVOICE[i], 0)
                }
                else if ((val == true) && ((i + 1) == this.state.CF_ALL_INVOICE.length)) {
                    this.tracking(this.state.stack_IVOICE[i], 1)
                }
            });
        });
        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         console.log("wokeeey");
        //         console.log(position);
        //         this.setState({
        //             latitude: position.coords.latitude,
        //             longitude: position.coords.longitude,
        //             error: null,
        //         }, () => {
        //             this.state.CF_ALL_INVOICE.map((val, i) => {
        //                 if ((val == true) && ((i + 1) != this.state.CF_ALL_INVOICE.length)) {
        //                     this.tracking(this.state.stack_IVOICE[i], 0)
        //                 }
        //                 else if ((val == true) && ((i + 1) == this.state.CF_ALL_INVOICE.length)) {
        //                     this.tracking(this.state.stack_IVOICE[i], 1)
        //                 }
        //             });
        //         });
        //     },
        //     (error) => this.setState({ error: error.message }),
        //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
        // );
    }

    worklist_query = () => {
        console.log('worklist_query')

        this.props.client.query({
            query: querywork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTable: result.data.querywork
            })
             console.log("8888888888888888888888888888888888888888888888888888888888888888888888888"+result)
        }).catch((err) => {
            console.log(err)
        });
    }

    selectwork = () => {
        console.log('selectwork')

        this.props.client.query({
            query: selectwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTableGreen: result.data.selectwork,
                load:false
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    _Re_worklist_query = () => {
        this.props.client.resetStore();
        console.log('_Re_worklist_query')
        this.setState({ refreshing_1: true });
        this.worklist_query();
        this.selectwork();
        this.setState({ CF_ALL_INVOICE: [], stack_IVOICE: [] })
        this.setState({ refreshing_1: false });
    }

    confirmworksome = (inV, i) => {
        console.log("confirmworksome")

        this.props.client.mutate({
            mutation: confirmworksome,
            variables: {
                "invoiceNumber": inV
            }
        }).then((result) => {
            if (!result.data.confirmworksome.status) {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            } else {
                if (i == 0) {
                    console.log(result)
                } else if (i == 1) {
                    this._Re_worklist_query();
                }
            }

        }).catch((err) => {
            console.log(err)
        });
    }

    tracking = (inV, i) => {
        console.log("tracking")
        this.props.client.mutate({
            mutation: tracking,
            variables: {
                "invoice": inV,
                "status": "5",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            this.confirmworksome(inV, i)
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
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

    checkinvoice = () => {
        const { navigate } = this.props.navigation
        this.props.client.query({
            query: checkinvoice,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({ showINVOICE_ID: result.data.checkinvoice })
            if (this.state.showINVOICE_ID.length > 0) {
                this.billTOapp();
            } else {
                this.roundout();
            }
        }).catch((err) => {
            console.log("err of checkinvoice", err)
        });
    }

    billTOapp = () => {
        const { navigate } = this.props.navigation
        console.log("billTOapp")
        this.props.client.mutate({
            mutation: billTOapp,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            // this.state.showINVOICE_ID.map(l => {
            //     this.detailtoapp(l.INVOICEID);
            // });
            this.detailtoapp_v2() 
            Alert.alert(
                "คุณมีรายการอื่นที่ยังไม่ได้ตรวจ",
                "ต้องการกลับไปตรวจหรือออกรอบเลย",
                [
                    { text: "ยกเลิก", onPress: () => this._Re_worklist_query() },
                    { text: "ยืนยัน", onPress: () => this.roundout()}
                ]
            )

            // navigator.geolocation.getCurrentPosition(
            //     (position) => {
            //         console.log("wokeeey");
            //         console.log(position);
            //         this.setState({
            //             latitude: position.coords.latitude,
            //             longitude: position.coords.longitude,
            //             error: null,
            //         }, () => {
            //             console.log(global.NameOfMess)
            //             console.log("result", result.data.billTOapp)
            //             this.state.showINVOICE_ID.map(l => {
            //                 this.detailtoapp(l.INVOICEID);
            //             });
            //             Alert.alert(
            //                 "คุณมีรายการอื่นที่ยังไม่ได้ตรวจ",
            //                 "ต้องการกลับไปตรวจหรือออกรอบเลย",
            //                 [
            //                     { text: "ยกเลิก", onPress: () => this._Re_worklist_query() },
            //                     { text: "ยืนยัน", onPress: () => this.roundout()}
            //                 ]
            //             )
            //         });
            //     },
            //     (error) => this.setState({ error: error.message }),
            //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 },
            // );
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
                this.tracking2(l.INVOICEID, "4", global.NameOfMess, this.state.latitude, this.state.longitude);
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
            this.tracking2(id, "4", global.NameOfMess, this.state.latitude, this.state.longitude);
        }).catch((err) => {
            console.log("error", err)
        });
    }

    tracking2 = (invoice, status, messID, lat, long) => {
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

    //--------------------------------------------------------------------------------------------------------------
    // ยืนยันงานทั้งหมด แบบเก่า
    /*confirmwork = () => {
        console.log("confirmwork")

        this.props.client.mutate({
            mutation: confirmwork,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            if (result.data.confirmwork.status) {
                this._Re_worklist_query()
            } else {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานนี้ไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: ()  => console.log("ok") },
                    ]
                )
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    Trackingstatus4 = () => {
        console.log("Trackingstatus4")

        this.props.client.mutate({
            mutation: Trackingstatus4,
            variables: {
                "status": "5",
                "location": "NULL",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            console.log("Result of Trackingstatus4", result.data.Trackingstatus4)
            this.confirmwork()
        }).catch((err) => {
            console.log(err)
        });
    }*/
    //--------------------------------------------------------------------------------------------------------------

    render() {

        const { navigate } = this.props.navigation

        return (

            <Container>
          
                <Header style={{ backgroundColor: '#66c2ff' }}>
                    <Left>
                        <Button transparent
                            onPress={() => { this.props.client.resetStore(); navigate("MainMenu"); }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>ตรวจงาน</Title>
                    </Body>
                    <Right>

                    </Right>
                </Header>
             
                <Content refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing_1}
                        onRefresh={this._Re_worklist_query}
                    />
                }>
                    {/* <View style={[styles.container, styles.horizontal]}>
                        <ActivityIndicator size="large" color="#0000ff" /> */}

                 

                    <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5, marginBottom: 5 }}>
                        <View style={{ marginLeft: 20 }}>
                            <CheckBox
                                value={this.state.status_CHECKBOX}
                                onValueChange={() => {
                                    this.setState({ status_CHECKBOX: !this.state.status_CHECKBOX })
                                    this.state.showTable.map((i, k) => {
                                        let n = this.state.CF_ALL_INVOICE;
                                        let s = this.state.stack_IVOICE;
                                        n[k] = !this.state.status_CHECKBOX
                                        s[k] = i.invoiceNumber
                                        this.setState({
                                            CF_ALL_INVOICE: n,
                                            stack_IVOICE: s
                                        })
                                    })
                                }} />
                        </View>
                        <Text>เลือกทั้งหมด</Text>
                    </View>
                    
                    <View style={[styles.container, styles.horizontal]}>
                        {
                         
                            this.state.load ?
                                <ActivityIndicator size="small" color="#00ff00" />
                                :
                               <View style={{top:0}}>
                               </View>
                  
             
                              
                        }
                    </View>

                    <View>
                        {
                            this.state.showTable.map((l, i) => (
                                <ListItem noIndent >
                                    <CheckBox
                                        value={this.state.CF_ALL_INVOICE[i]}
                                        onValueChange={() => {
                                            if (this.state.CF_ALL_INVOICE[i] == true) {
                                                let n = this.state.CF_ALL_INVOICE.slice();
                                                let s = this.state.stack_IVOICE.slice();
                                                n[i] = false
                                                s[i] = l.invoiceNumber
                                                this.setState({
                                                    CF_ALL_INVOICE: n,
                                                    stack_IVOICE: s
                                                }, () => {
                                                    console.log("if 1 CF", this.state.CF_ALL_INVOICE)
                                                    console.log("if 1 CF", this.state.stack_IVOICE)
                                                })

                                            }
                                            else if (this.state.CF_ALL_INVOICE[i] == false) {
                                                let n = this.state.CF_ALL_INVOICE.slice();
                                                let s = this.state.stack_IVOICE.slice();
                                                n[i] = true
                                                s[i] = l.invoiceNumber
                                                this.setState({
                                                    CF_ALL_INVOICE: n,
                                                    stack_IVOICE: s
                                                }, () => {
                                                    console.log("if 2 CF", this.state.CF_ALL_INVOICE)
                                                    console.log("if 1 CF", this.state.stack_IVOICE)
                                                })

                                            }
                                            else {
                                                let n = this.state.CF_ALL_INVOICE.slice();
                                                let s = this.state.stack_IVOICE.slice();
                                                n[i] = true
                                                s[i] = l.invoiceNumber
                                                this.setState({
                                                    CF_ALL_INVOICE: n,
                                                    stack_IVOICE: s
                                                }, () => {
                                                    console.log("if 3 CF", this.state.CF_ALL_INVOICE)
                                                    console.log("if 1 CF", this.state.stack_IVOICE)
                                                })

                                            }

                                        }} />
                                    <Body>
                                        <View style={{ left: 0, right: 0, top: 0, bottom: 0, }}>
                                            <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                                                onPress={() => navigate('CheckWork', { id: l.invoiceNumber, refresion: this._Re_worklist_query })}
                                            >
                                                <Text style={styles.storeLabel}>{i + 1}).{l.invoiceNumber}</Text>
                                                <Text note>{l.DELIVERYNAME}</Text>
                                                
                                            </TouchableOpacity>
                                        </View>
                                    </Body>
                                    <Right>
                                        <Button transparent
                                            onPress={() => navigate('CheckWork', { id: l.invoiceNumber, refresion: this._Re_worklist_query })}>
                                        
                                            <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                                        </Button>
                                    </Right>
                                </ListItem>
                            ))
                        }
                    </View>
                    <View>
                        {
                            this.state.showTableGreen.map((l, i) => (
                                <ListItem noIndent style={{ backgroundColor: "#A9FC93" }}>
                                    <Body>
                                        <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                                            onPress={() => navigate('CheckWork', { id: l.invoiceNumber, refresion: this._Re_worklist_query })}
                                        >
                                            <Text style={styles.storeLabel}>{i + 1}).{l.invoiceNumber}</Text>
                                            <Text note>{l.DELIVERYNAME}</Text>
                                        </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <Button transparent
                                            onPress={() => navigate('CheckWork', { id: l.invoiceNumber, refresion: this._Re_worklist_query })}>
                                            <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                                        </Button>
                                    </Right>
                                </ListItem>
                            ))
                        }
                    </View>

                </Content>

                {
                    (() => {
                        console.log("this.state.showTable", this.state.showTable.length)
                        if (this.state.showTable.length > 0) {
                            return (
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            console.log(this.state.CF_ALL_INVOICE)
                                            if (this.state.CF_ALL_INVOICE.every(this.checkDATA)) {
                                                Alert.alert(
                                                    'ไม่สามารถตรวจงานได้',
                                                    'กรุณาเลือกงาน'
                                                )
                                            } else {
                                                Alert.alert(
                                                    'ตรวจงานทั้งหมด',
                                                    'คุณต้องการตรวจงานทั้งหมด?',
                                                    [

                                                        { text: 'ไม่', onPress: () => console.log("no") },
                                                        { text: 'ใช่', onPress: () => this.checkpending(0) },
                                                    ]
                                                )
                                            }

                                        }
                                    }
                                >
                                    <Footer style={{
                                        backgroundColor: '#ff6c00',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ตรวจงานทั้งหมด</Text>
                                    </Footer>

                                </TouchableOpacity>
                            )
                        } else if (this.state.showTable.length == 0) {
                            return (
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            Alert.alert(
                                                'ยืนยันการออกรอบ',
                                                'คุณต้องการออกรอบเลยหรือไม่?',
                                                [

                                                    { text: 'ยกเลิก', onPress: () => console.log("no") },
                                                    { text: 'ยืนยัน', onPress: () => { this.checkpending(1) } },
                                                ]
                                            )
                                        }
                                    }
                                >
                                    <Footer style={{
                                        backgroundColor: '#33CC33',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ส่งงาน</Text>
                                    </Footer>
                                </TouchableOpacity>
                            )
                        }
                    })()
                }

            </Container >
         
          
        );
    }


}

const GraphQL = compose(HomeTab)
export default withApollo(GraphQL)


const querywork = gql`
    query querywork($MessengerID:String!){
                        querywork(MessengerID: $MessengerID){
                    invoiceNumber
                    customerName
                    DELIVERYNAME
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
const selectwork = gql`
    query selectwork($MessengerID:String!){
                        selectwork(MessengerID: $MessengerID){
                        invoiceNumber
            customerName
                    DELIVERYNAME
                }
            }
        `

const confirmworksome = gql`
    mutation confirmworksome($invoiceNumber:String!){
        confirmworksome(invoiceNumber: $invoiceNumber){
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

const roundout = gql`
    mutation roundout($MessengerID:String!){
        roundout(MessengerID: $MessengerID){
            status
        }
    }
`

//-----------------------------------------------------------------------------------------------
// const confirmwork = gql`
//     mutation confirmwork($MessengerID:String!){
//                         confirmwork(MessengerID: $MessengerID){
//                         status
//                     }
//                     }
//                 `

// const Trackingstatus4 = gql`
//     mutation Trackingstatus4(
//             $status:String!,
//             $location:String!,
//             $messengerID:String!,
//             $lat:Float!,
//             $long:Float!
//         ){
//         Trackingstatus4(
//                 status: $status,
//                 location: $location,
//                 messengerID: $messengerID,
//                 lat: $lat,
//                 long: $long
//             ){
//                 status
//             }
//         }
//     `
//-----------------------------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    storeLabel: {
        fontSize: 18,
        color: 'black'
    },
    detailContent: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        justifyContent: 'center'
    },
    detailContentGREEN: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#77F156'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        justifyContent: "center"
      }
})
