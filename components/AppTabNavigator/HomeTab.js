import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, TouchableOpacity, RefreshControl, CheckBox,ActivityIndicator } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, List, ListItem, Item,TabHeading,Tab, Tabs } from 'native-base';
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
            stack_box:[],
            status_CHECKBOX: false,
            load:true,
            specialJob:[],
            specialJobGreen:[],
       
        }
        // this.props.client.resetStore();
        //this.checkwork();
        this.worklist_query();
        this.selectwork();
        this.special_query();
        this.special_pass();
      //  mainService.load(v => this.setState({load:true}))
    }

    checkDATA = (e) => {
        return (e == null) || (e == false)
    }


    checkpending = (selection) => {
      
        const { navigate } = this.props.navigation
        console.log('selection',selection)
       // console.log('checkwork222222222222222222222222222222222222222222222222222222')
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

               // this.GET_LOCATE()
                if(selection ==0)
                {
                  //  console.log("000000000000000000000000000000000000000")
                    this.GET_LOCATE()
                    
                }
                else{
             
                    this.checkinvoice()
                }
              
                
            }
          
        }).catch((err) => {
            console.log(err)
        });
       
    }
    checkpending_SC = (selection) => {
      
        const { navigate } = this.props.navigation
        console.log('selection',selection)
       // console.log('checkwork222222222222222222222222222222222222222222222222222222')
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
                  //  console.log("000000000000000000000000000000000000000")
                    this.GET_LOCATE_SC()
                    
                }
                else{
             
                    this.checkinvoice()
                }
              
                
            }
          
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
                    this.tracking(this.state.stack_IVOICE[i],this.state.stack_box[i], 0)
                }
                else if ((val == true) && ((i + 1) == this.state.CF_ALL_INVOICE.length)) {
                    this.tracking(this.state.stack_IVOICE[i],this.state.stack_box[i], 1)
                }
            });
        });
   
    }
    GET_LOCATE_SC = () => {
        // console.log("componentDidMount")

        this.setState({
            latitude: 1,
            longitude: 1,
            error: null,
        }, () => {
            this.state.CF_ALL_INVOICE.map((val, i) => {
                if ((val == true) && ((i + 1) != this.state.CF_ALL_INVOICE.length)) {
                    this.tracking_SC(this.state.stack_IVOICE[i], 0)
                }
                else if ((val == true) && ((i + 1) == this.state.CF_ALL_INVOICE.length)) {
                    this.tracking_SC(this.state.stack_IVOICE[i], 1)
                }
            });
        });
   
    }
    worklist_query = () => { 
        console.log('worklist_query')

        this.props.client.query({
            query: querywork_DL,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTable: result.data.querywork_DL
            })
             //console.log("8888888888888888888888888888888888888888888888888888888888888888888888888"+result)
        }).catch((err) => {
            console.log(err)
        });
    }


    selectwork = () => {
        console.log('selectwork')

        this.props.client.query({
            query: selectWork_DL,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTableGreen: result.data.selectWork_DL,
                load:false
            })
        }).catch((err) => {
            console.log(err)
        });
    }
    special_query = () => {
        console.log('special_query')

        this.props.client.query({
            query: selectDataWork_SC,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                specialJob: result.data.selectDataWork_SC
            })
            // console.log("8888888888888888888888888888888888888888888888888888888888888888888888888"+result)
        }).catch((err) => {
            console.log(err)
        });
    }
    special_pass = () => {
        console.log('special_pass')

        this.props.client.query({
            query: selectWork_SC,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                specialJobGreen: result.data.selectWork_SC
            })
            console.log('Greenjob',result.data.selectWork_SC)
          //   console.log("8888888888888888888888888888888888888888888888888888888888888888888888888"+result)
        }).catch((err) => {
            console.log(err)
        });
    }
    _Re_worklist_query = () => {
        this.props.client.resetStore();
     //   console.log('_Re_worklist_query')
        this.setState({ refreshing_1: true });
        this.worklist_query();
        this.selectwork();
        this.special_query();
        this.special_pass();
        this.setState({ CF_ALL_INVOICE: [], stack_IVOICE: [],stack_box:[] })
        this.setState({ refreshing_1: false });
    }

    confirmworksome = (inV,box, i) => {
        //console.log("confirmworksome")
     
        this.props.client.mutate({
            mutation: confirmworksomeAll_DL,
            variables: {
                "invoiceNumber": inV,
                "numBox":box,
                "MessengerID":global.NameOfMess
            }
        }).then((result) => {
            if (!result.data.confirmworksomeAll_DL.status) {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            } else {
                if (i == 0) {
                    console.log("insert app_workapp succ",inV,box)
                } else if (i == 1) {
                    console.log("insert app_workapp succ",inV,box)
                 //   this.CheckUpdateBillToApp(inV,box,i)
                    this._Re_worklist_query();
                }
            }

        }).catch((err) => {
            console.log(err)
        });
    }
    CheckUpdateBillToApp = (inV,box,i) => {
        //console.log("confirmworksome")
     console.log("checkUpdate",inV,box,i)
        this.props.client.mutate({
            mutation: checkUpdateBilltoApp_DL,
            variables: {
                "invoiceNumber": inV,
                "numBox":box,
                "MessengerID":global.NameOfMess
            }
        }).then((result) => {
            if (!result.data.checkUpdateBilltoApp_DL.status) {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานไปแล้ว',
                    [
                        { text: 'ตกลง', onPress: () => console.log("ok") },
                    ]
                )
            } else {
          
                    console.log("insert app_workapp succ",inV,box,i)
                    this._Re_worklist_query();
                
            }

        }).catch((err) => {
            console.log(err)
        });
    }

    confirmworksome_SC = (inV, i) => {
        //console.log("confirmworksome")
        console.log('confirmworksome_SC',inV)
        this.props.client.mutate({
            mutation: receive_SC,
            variables: {
                "TSC": inV
            }
        }).then((result) => {
            if (!result.data.receive_SC.status) {
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
    tracking = (inV,box, i) => {
        console.log("tracking")
        console.log("result",inV,box,i)
        this.props.client.mutate({
            mutation: tracking_DL,
            variables: {
                "invoice": inV,
                "status": "5",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
                "box":box
            }
        }).then((result) => {
            this.confirmworksome(inV,box, i)
            console.log("insert tracking",inV,box)
        }).catch((err) => {
            console.log("ERR OF TRACKING", err)
        });
    }
    tracking_SC = (inV, i) => {
        console.log("trackingSC",inV)
        this.props.client.mutate({
            mutation: tracking_CN,
            variables: {
                "invoice": inV,
                "status": "5",
                "messengerID": global.NameOfMess,
                "lat": this.state.latitude,
                "long": this.state.longitude,
            }
        }).then((result) => {
            this.confirmworksome_SC(inV, i)
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
              //  this.billTOapp();
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
        <Tabs locked>
          <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}><Icon name="md-cart" /><Text style={{ color: 'white' }}>  งานปกติ</Text></TabHeading>}>
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
                                        let b = this.state.stack_box;
                                        n[k] = !this.state.status_CHECKBOX
                                        s[k] = i.invoiceNumber
                                        b[k] = i.NumBox
                                        this.setState({
                                            CF_ALL_INVOICE: n,
                                            stack_IVOICE: s,
                                            stack_box:b
                                        }, () => {
                                            console.log("if all CF", this.state.CF_ALL_INVOICE)
                                            console.log("if all CF", this.state.stack_IVOICE)
                                            console.log("if all CF",this.state.stack_box)
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
                                                let b = this.state.stack_box.slice();
                                                n[i] = false
                                                s[i] = l.invoiceNumber
                                                b[i] = l.NumBox
                                                this.setState({
                                                    CF_ALL_INVOICE: n,
                                                    stack_IVOICE: s,
                                                    stack_box:b
                                                }, () => {
                                                    console.log("if 1 CF", this.state.CF_ALL_INVOICE)
                                                    console.log("if 1 CF", this.state.stack_IVOICE)
                                                    console.log("if 1 CF",this.state.stack_box)
                                                })

                                            }
                                            else if (this.state.CF_ALL_INVOICE[i] == false) {
                                                let n = this.state.CF_ALL_INVOICE.slice();
                                                let s = this.state.stack_IVOICE.slice();
                                                let b = this.state.stack_box.slice();
                                                n[i] = true
                                                s[i] = l.invoiceNumber
                                                b[i] = l.NumBox
                                                this.setState({
                                                    CF_ALL_INVOICE: n,
                                                    stack_IVOICE: s,
                                                    stack_box:b
                                                }, () => {
                                                    console.log("if 2 CF", this.state.CF_ALL_INVOICE)
                                                    console.log("if 1 CF", this.state.stack_IVOICE)
                                                    console.log("if 1 CF",this.state.stack_box)
                                                })

                                            }
                                            else {
                                                let n = this.state.CF_ALL_INVOICE.slice();
                                                let s = this.state.stack_IVOICE.slice();
                                                let b = this.state.stack_box.slice();
                                                n[i] = true
                                                s[i] = l.invoiceNumber
                                                b[i] = l.NumBox
                                                this.setState({
                                                    CF_ALL_INVOICE: n,
                                                    stack_IVOICE: s,
                                                    stack_box:b
                                                }, () => {
                                                    console.log("if 3 CF", this.state.CF_ALL_INVOICE)
                                                    console.log("if 1 CF", this.state.stack_IVOICE)
                                                    console.log("if 1 CF",this.state.stack_box)
                                                })

                                            }

                                        }} />
                                    <Body>
                                        <View style={{ left: 0, right: 0, top: 0, bottom: 0, }}>
                                            <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                                                onPress={() => navigate('CheckWork', { id: l.invoiceNumber,NumBox:l.NumBox, refresion: this._Re_worklist_query })}
                                            >
                                                <Text style={styles.storeLabel}>{i + 1}).{l.invoiceNumber}</Text>
                                                <Text note>{l.DELIVERYNAME}</Text>
                                                
                                            </TouchableOpacity>
                                        </View>
                                    </Body>
                                    <Right>
                                        <Button transparent
                                            onPress={() => navigate('CheckWork', { id: l.invoiceNumber,NumBox:l.NumBox, refresion: this._Re_worklist_query })}>
                                            <Text style={styles.storeLabel}>{l.NumBox}/{l.QtyBox}</Text>
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
                                            onPress={() => navigate('CheckWork', { id: l.invoiceNumber,NumBox:l.NumBox, refresion: this._Re_worklist_query })}
                                        >
                                            <Text style={styles.storeLabel}>{i + 1}).{l.invoiceNumber}</Text>
                                            <Text note>{l.DELIVERYNAME}</Text>
                                        </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <Button transparent
                                            onPress={() => navigate('CheckWork', { id: l.invoiceNumber,NumBox:l.NumBox, refresion: this._Re_worklist_query })}>
                                            <Text style={styles.storeLabel}>{l.NumBox}/{l.QtyBox}</Text>
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
                        } else if (this.state.showTable.length == 0&&this.state.specialJob.length == 0) {
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
                </Tab>

                {/* --------------------------Tab Job Special--------------------------------------------------------- */}
                <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}><Icon name="md-checkbox-outline" /><Text style={{ color: 'white' }}>  งานพิเศษ</Text></TabHeading>}>
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
                                    this.state.specialJob.map((i, k) => {
                                        let n = this.state.CF_ALL_INVOICE;
                                        let s = this.state.stack_IVOICE;
                                        n[k] = !this.state.status_CHECKBOX
                                        s[k] = i.tsc_document
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
                            this.state.specialJob.map((l, i) => (
                                <ListItem noIndent >
                                    <CheckBox
                                        value={this.state.CF_ALL_INVOICE[i]}
                                        onValueChange={() => {
                                            if (this.state.CF_ALL_INVOICE[i] == true) {
                                                let n = this.state.CF_ALL_INVOICE.slice();
                                                let s = this.state.stack_IVOICE.slice();
                                                n[i] = false
                                                s[i] = l.tsc_document
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
                                                s[i] = l.tsc_document
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
                                                s[i] = l.tsc_document
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
                                                onPress={() => navigate('RecieveWork', { id: l.tsc_document,cusname:l.customerName,Zone:l.Zone,address:l.address_shipment,task_detail:l.task_detail,
                                                    user_request_name:l.user_request_name,user_request_tel:l.user_request_tel,receive_date:l.receive_date,receive_time_first:l.receive_time_first,
                                                    send_to:l.send_to,send_time_first:l.send_time_first,send_tel:l.send_tel,task_group:l.task_group,task_group_document:l.task_group_document,task_group_quantity:l.task_group_quantity,receive_from:l.receive_from,
                                                    comment:l.comment,send_date:l.send_date,refresion: this._Re_worklist_query })}
                                            >
                                                <Text style={styles.storeLabel}>{i + 1}).{l.tsc_document}</Text>
                                                <Text note>{l.customerName}</Text>
                                                
                                            </TouchableOpacity>
                                        </View>
                                    </Body>
                                    <Right>
                                        <Button transparent
                                            onPress={() => navigate('RecieveWork', { id: l.tsc_document,cusname:l.customerName,Zone:l.Zone,address:l.address_shipment,task_detail:l.task_detail,
                                                user_request_name:l.user_request_name,user_request_tel:l.user_request_tel,receive_date:l.receive_date,receive_time_first:l.receive_time_first,
                                                send_to:l.send_to,send_time_first:l.send_time_first,send_tel:l.send_tel,task_group:l.task_group,task_group_document:l.task_group_document,task_group_quantity:l.task_group_quantity,receive_from:l.receive_from,
                                                comment:l.comment,send_date:l.send_date,refresion: this._Re_worklist_query })}>
                                        
                                            <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                                        </Button>
                                    </Right>
                                </ListItem>
                            ))
                        }
                    </View>
                    <View>
                        {
                            this.state.specialJobGreen.map((l, i) => (
                                <ListItem noIndent style={{ backgroundColor: "#A9FC93" }}>
                                    <Body>
                                        <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                                            onPress={() => navigate('RecieveWork', { id: l.tsc_document,cusname:l.customerName,Zone:l.Zone,address:l.address_shipment,task_detail:l.task_detail,
                                                user_request_name:l.user_request_name,user_request_tel:l.user_request_tel,receive_date:l.receive_date,receive_time_first:l.receive_time_first,
                                                send_to:l.send_to,send_time_first:l.send_time_first,send_tel:l.send_tel,task_group:l.task_group,task_group_document:l.task_group_document,task_group_quantity:l.task_group_quantity,receive_from:l.receive_from,
                                                comment:l.comment,send_date:l.send_date, refresion: this._Re_worklist_query})}
                                        >
                                            <Text style={styles.storeLabel}>{i + 1}).{l.tsc_document}</Text>
                                            <Text note>{l.customerName}</Text>
                                        </TouchableOpacity>
                                    </Body>
                                    <Right>
                                        <Button transparent
                                             onPress={() => navigate('RecieveWork', { id: l.tsc_document,cusname:l.customerName,Zone:l.Zone,address:l.address_shipment,task_detail:l.task_detail,
                                                user_request_name:l.user_request_name,user_request_tel:l.user_request_tel,receive_date:l.receive_date,receive_time_first:l.receive_time_first,
                                                send_to:l.send_to,send_time_first:l.send_time_first,send_tel:l.send_tel,task_group:l.task_group,task_group_document:l.task_group_document,task_group_quantity:l.task_group_quantity,receive_from:l.receive_from,
                                                comment:l.comment,send_date:l.send_date, refresion: this._Re_worklist_query})}>
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
                        console.log("this.state.showTable", this.state.specialJob.length)
                        if (this.state.specialJob.length > 0) {
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
                                                        { text: 'ใช่', onPress: () => this.checkpending_SC(0) },
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
                        } else if (this.state.specialJob.length == 0 && this.state.showTable.length ==0) {
                            return (
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            Alert.alert(
                                                'ยืนยันการออกรอบ',
                                                'คุณต้องการออกรอบเลยหรือไม่?',
                                                [

                                                    { text: 'ยกเลิก', onPress: () => console.log("no") },
                                                    { text: 'ยืนยัน', onPress: () => { this.checkpending_SC(1) } },
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
                </Tab>
                </Tabs>
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
const querywork_DL = gql`
    query querywork_DL($MessengerID:String!){
        querywork_DL(MessengerID: $MessengerID){
            invoiceNumber
            customerName
            DELIVERYNAME
            QtyBox
            NumBox
                }
            }
        `
const selectDataWork_SC = gql`
    query selectDataWork_SC($MessengerID:String!){
        selectDataWork_SC(MessengerID: $MessengerID){
                    tsc_document
                    customerName
                    Zone
                    address_shipment
                    task_detail
                    user_request_name
                    user_request_tel
                    receive_from
                    receive_date
                    receive_time_first
                    send_to
                    send_time_first
                    send_tel
                    task_group
                    task_group_document
                    task_group_quantity
                    comment
                    send_date
                }
            }
        `
const selectWork_SC = gql`
    query selectWork_SC($MessengerID:String!){
        selectWork_SC(MessengerID: $MessengerID){
                    tsc_document
                    customerName
                    Zone
                    address_shipment
                    task_detail
                    user_request_name
                    user_request_tel
                    receive_from
                    receive_date
                    receive_time_first
                    send_to
                    send_time_first
                    send_tel
                    task_group
                    task_group_document
                    task_group_quantity
                    comment
                    send_date
                    
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
const selectWork_DL = gql`
        query selectWork_DL($MessengerID:String!){
            selectWork_DL(MessengerID: $MessengerID){
                                invoiceNumber
                                customerName
                                DELIVERYNAME
                                QtyBox
                                NumBox
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
const confirmworksomeAll_DL = gql`
    mutation confirmworksomeAll_DL($invoiceNumber:String!,$numBox:String!,$MessengerID:String!){
        confirmworksomeAll_DL(invoiceNumber: $invoiceNumber,numBox:$numBox,MessengerID:$MessengerID){
            status
        }
    }
`
const checkUpdateBilltoApp_DL = gql`
    mutation checkUpdateBilltoApp_DL($invoiceNumber:String!,$numBox:String!,$MessengerID:String!){
        checkUpdateBilltoApp_DL(invoiceNumber: $invoiceNumber,numBox:$numBox,MessengerID:$MessengerID){
            status
        }
    }
`
const confirmworksome_DL = gql`
    mutation confirmworksome_DL($invoiceNumber:String!,$numBox:String!,$MessengerID:String!){
        confirmworksome_DL(invoiceNumber: $invoiceNumber,numBox:$numBox,MessengerID:$MessengerID){
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
const tracking_DL = gql`
    mutation tracking_DL(
        $invoice:String!,
        $status:String!,
        $messengerID:String!,
        $lat:Float!,
        $long:Float!,
        $box:String!
    ){
        tracking_DL(
            invoice: $invoice,
            status: $status,
            messengerID: $messengerID,
            lat: $lat,
            long: $long,
            box:$box
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

const roundout = gql`
    mutation roundout($MessengerID:String!){
        roundout(MessengerID: $MessengerID){
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
