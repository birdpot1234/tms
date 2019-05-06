import React, { Component } from 'react'
import { Text, StyleSheet, StatusBar, Alert, View, Platform, Image, Dimensions, TouchableOpacity, RefreshControl, CheckBox, ActivityIndicator, FlatList } from 'react-native'
import { Icon, Container, Header, Left, Body, Title, Right, Button, Content, Footer, List, ListItem, Item, TabHeading, Tab, Tabs } from 'native-base';
import { post } from '../services'
import { gql, withApollo, compose } from 'react-apollo'
import { Empty } from '../../comp/FlatList'
import { normalize } from '../../functions/normalize';
import font from '../../resource/font';
import SpecialTab from './HomeTab/SpecialTab';

console.disableYellowBox = true;

class HomeTab extends Component {
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
            stack_box: [],
            id: [],
            status_CHECKBOX: false,
            loading: false,
            loadingSpecial: true,
            specialJob: [],
            specialJobGreen: [],
        }
    }

    componentDidMount = () => {
        this.worklist_query();
        this.selectwork();
        this.special_query();
        this.special_pass();
    }


    checkDATA = (e) => {
        return (e == null) || (e == false)
    }

    worklist_query = () => {
        this.props.client.query({
            query: querywork_DL,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            console.log(result.data)
            this.setState({ showTable: result.data.querywork_DL, loading: true })
        }).catch((err) => {
            console.log(err)
        });
    }

    selectwork = () => {
        this.props.client.query({
            query: selectWork_DL,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({
                showTableGreen: result.data.selectWork_DL,
                CF_ALL_INVOICE: [],
                stack_IVOICE: [],
                stack_box: [],
                refreshing_1: false
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    special_query = () => {
        this.props.client.query({
            query: selectDataWork_SC,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({ specialJob: result.data.selectDataWork_SC })
        }).catch((err) => {
            console.log(err)
        });
    }

    special_pass = () => {
        this.props.client.query({
            query: selectWork_SC,
            variables: {
                "MessengerID": global.NameOfMess
            }
        }).then((result) => {
            this.setState({ specialJobGreen: result.data.selectWork_SC })
        }).catch((err) => {
            console.log(err)
        });
    }

    _Re_worklist_query = () => {
        this.props.client.resetStore();
        this.setState({ refreshing_1: true, status_CHECKBOX: false });

        this.worklist_query();
        this.selectwork();

        this.special_query();
        this.special_pass();
    }

    onRefreshSpecial = async () => {
        this.props.client.resetStore();
        this.setState({ refreshing_1: true });

        this.special_query();
        this.special_pass();

        this.worklist_query();
        this.selectwork();
    }

    checkpending = (selection) => {
        this.setState({ refreshing_1: true }, () => {
            const { navigate } = this.props.navigation
            this.props.client.query({
                query: selectpendingwork,
                variables: {
                    "MessengerID": global.NameOfMess
                }
            }).then((result) => {
                if (result.data.selectpendingwork.status) {
                    Alert.alert(
                        'คุณยังมีงานที่ยังค้างการส่งหรือยังไม่สรุปยอด',
                        'คุณต้องการเคลียงานเก่า?',
                        [
                            { text: 'ใช่', onPress: () => navigate("Search") },
                        ]
                    )
                } else {
                    if (selection == 0) {
                        this.GET_LOCATE()
                    } else {
                        // this.checkinvoice()
                        this.setState({ refreshing_1: false }, () => navigate("Search"))
                    }
                }
            }).catch((err) => {
                this.setState({ refreshing_1: false })
                console.log(err)
            });
        })
    }

    GET_LOCATE = () => {
        try {
            let { stack_IVOICE, id } = this.state
            let filter = stack_IVOICE.filter(el => el);
            let filterId = id.filter(el => el)

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    let { latitude, longitude } = position.coords
                    await this.confirmworksome(filter, filterId)
                    await this.tracking(filter, latitude, longitude)
                    // let boxfilter = stack_box.filter(el => el);
                    // filter.forEach(async (val, i) => {
                    //     let stop = ((i + 1) !== filter.length) ? 0 : 1 // เช็คว่าตัวสุดท้ายหรือเปล่า
                    //     await this.tracking(val, boxfilter[i], stop, latitude, longitude)
                    // })
                },
                async (error) => {
                    this.setState({ refreshing_1: false })
                    console.log(error)
                    await this.confirmworksome(filter, filterId)
                    await this.tracking(filter, -1, -1)
                    // let boxfilter = stack_box.filter(el => el);
                    // filter.forEach(async (val, i) => {
                    //     let stop = ((i + 1) !== filter.length) ? 0 : 1 // เช็คว่าตัวสุดท้ายหรือเปล่า
                    //     await this.tracking(val, boxfilter[i], stop, -1, -1)
                    // })
                },
            );
        } catch (error) {
            this.setState({ refreshing_1: false })
            console.log(error)
        }
    }

    tracking = async (invoiceNumber, latitude, longitude) => {
        try {
            await post(":3499/tms/api/tracking", JSON.stringify({ invoiceNumber, mess_id: global.NameOfMess, latitude, longitude, status: "5" }))
        } catch (error) {
            console.log(error)
        }
    }


    confirmworksome = async (inV, _id) => {
        try {
            let invoicenumber = inV.filter((v, i) => inV.indexOf(v) === i)
            let id = _id.filter((v, i) => _id.indexOf(v) === i);
            let result = await post(":3499/tms/api/confirmsome", JSON.stringify({ invoicenumber, mess_id: global.NameOfMess, id }))
            if (result.success) {
                setTimeout(() => {
                    console.log('refresh worklist')
                    this._Re_worklist_query();
                }, 100)
            } else {
                Alert.alert(
                    'ตรวจงานไม่สำเร็จ',
                    'มีการตรวจงานไปแล้ว',
                    [
                        {
                            text: 'ตกลง', onPress: () =>
                                setTimeout(() => {
                                    console.log('refresh worklist')
                                    this._Re_worklist_query();
                                }, 100)
                        },
                    ]
                )
            }
        } catch (error) {
            console.log(error)
        }
    }


    /**
     * @param number i // index
     */
    onValueChange = (item, i) => {
        let n = this.state.CF_ALL_INVOICE.slice();
        let s = this.state.stack_IVOICE.slice();
        let id = this.state.id.slice()

        if (this.state.CF_ALL_INVOICE[i] == true) {
            n[i] = false
            s[i] = null
            id[i] = null
        } else {
            n[i] = true
            s[i] = item.invoiceNumber
            id[i] = item.id
        }
        this.setState({ CF_ALL_INVOICE: n, stack_IVOICE: s, id })
    }

    onValueChangeCheckAll = () => {
        let { showTable } = this.state
        let n = this.state.CF_ALL_INVOICE;
        let s = this.state.stack_IVOICE;
        let id = this.state.id;

        if (this.state.status_CHECKBOX) {
            n = []
            s = []
            id = []
        } else {
            showTable.forEach((el, i) => {
                n[i] = !this.state.status_CHECKBOX
                s[i] = el.invoiceNumber
                id[i] = el.id
            })
        }

        this.setState(prev => ({
            status_CHECKBOX: !prev.status_CHECKBOX,
            CF_ALL_INVOICE: n,
            stack_IVOICE: s,
            id
        }))
    }

    render() {
        let { loading, showTable, specialJob, specialJobGreen, status_CHECKBOX } = this.state

        return (
            <Container>
                <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
                <Tabs locked>
                    <Tab heading={
                        <TabHeading style={{ backgroundColor: '#66c2ff' }}>
                            <Icon name="md-cart" style={{ fontSize: normalize(24) }} />
                            <Text style={{ color: 'white', fontSize: normalize(18) }}>  งานปกติ</Text>
                        </TabHeading>}>
                        {loading ? <Content refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing_1}
                                onRefresh={this._Re_worklist_query}
                            />
                        }>
                            {showTable.length > 0 &&
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, borderBottomColor: 'gray', borderBottomWidth: 0.5,
                                    marginBottom: normalize(5), paddingVertical: normalize(10)
                                }}>
                                    <View style={{ marginLeft: normalize(10) }}>
                                        <CheckBox
                                            value={status_CHECKBOX}
                                            onValueChange={this.onValueChangeCheckAll} />
                                    </View>
                                    <Text style={{ fontSize: normalize(16) }}>เลือกทั้งหมด</Text>
                                </View>
                            }

                            <FlatList
                                data={this.state.showTable}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderCheckJob(item, index)}
                                ListEmptyComponent={<Empty title={'ไม่มีรายการตรวจงาน'} />}
                            />

                            {/*####################### รับงานแล้ว #######################*/}
                            <FlatList
                                data={this.state.showTableGreen}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this.renderReceive(item, index)}
                                ListHeaderComponent={() => this.state.showTableGreen.length > 0 && <View style={{ paddingVertical: normalize(8) }}>
                                    <Text style={{ fontSize: normalize(18), fontFamily: font.semi, marginLeft: normalize(8) }}>รายการที่ตรวจงานแล้ว</Text>
                                </View>}
                            />

                        </Content> : <View style={{ flex: 1 }} />}

                        {loading && this.renderFooterWork()}
                    </Tab>

                    {/* --------------------------Tab Job Special--------------------------------------------------------- */}
                    <Tab heading={<TabHeading style={{ backgroundColor: '#66c2ff' }}>
                        <Icon name="md-checkbox-outline" style={{ fontSize: normalize(24) }} />
                        <Text style={{ color: 'white', fontSize: normalize(18) }}>  งานพิเศษ</Text>
                    </TabHeading>}>
                        <SpecialTab
                            refreshing_1={this.state.refreshing_1}
                            onRefreshSpecial={this.onRefreshSpecial}
                            showTable={showTable}
                            specialJob={specialJob}
                            specialJobGreen={specialJobGreen}
                            navigation={this.props.navigation}
                        />

                        {/* <View>
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
                                                            onPress={() => navigate('RecieveWork', {
                                                                id: l.tsc_document, cusname: l.customerName, Zone: l.Zone, address: l.address_shipment, task_detail: l.task_detail,
                                                                user_request_name: l.user_request_name, user_request_tel: l.user_request_tel, receive_date: l.receive_date, receive_time_first: l.receive_time_first,
                                                                send_to: l.send_to, send_time_first: l.send_time_first, send_tel: l.send_tel, task_group: l.task_group, task_group_document: l.task_group_document, task_group_quantity: l.task_group_quantity, receive_from: l.receive_from,
                                                                comment: l.comment, send_date: l.send_date, refresion: this._Re_worklist_query
                                                            })}
                                                        >
                                                            <Text style={styles.storeLabel}>{i + 1}).{l.tsc_document}</Text>
                                                            <Text note>{l.customerName}</Text>

                                                        </TouchableOpacity>
                                                    </View>
                                                </Body>
                                                <Right>
                                                    <Button transparent
                                                        onPress={() => navigate('RecieveWork', {
                                                            id: l.tsc_document, cusname: l.customerName, Zone: l.Zone, address: l.address_shipment, task_detail: l.task_detail,
                                                            user_request_name: l.user_request_name, user_request_tel: l.user_request_tel, receive_date: l.receive_date, receive_time_first: l.receive_time_first,
                                                            send_to: l.send_to, send_time_first: l.send_time_first, send_tel: l.send_tel, task_group: l.task_group, task_group_document: l.task_group_document, task_group_quantity: l.task_group_quantity, receive_from: l.receive_from,
                                                            comment: l.comment, send_date: l.send_date, refresion: this._Re_worklist_query
                                                        })}>

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
                                                        onPress={() => navigate('RecieveWork', {
                                                            id: l.tsc_document, cusname: l.customerName, Zone: l.Zone, address: l.address_shipment, task_detail: l.task_detail,
                                                            user_request_name: l.user_request_name, user_request_tel: l.user_request_tel, receive_date: l.receive_date, receive_time_first: l.receive_time_first,
                                                            send_to: l.send_to, send_time_first: l.send_time_first, send_tel: l.send_tel, task_group: l.task_group, task_group_document: l.task_group_document, task_group_quantity: l.task_group_quantity, receive_from: l.receive_from,
                                                            comment: l.comment, send_date: l.send_date, refresion: this._Re_worklist_query
                                                        })}
                                                    >
                                                        <Text style={styles.storeLabel}>{i + 1}).{l.tsc_document}</Text>
                                                        <Text note>{l.customerName}</Text>
                                                    </TouchableOpacity>
                                                </Body>
                                                <Right>
                                                    <Button transparent
                                                        onPress={() => navigate('RecieveWork', {
                                                            id: l.tsc_document, cusname: l.customerName, Zone: l.Zone, address: l.address_shipment, task_detail: l.task_detail,
                                                            user_request_name: l.user_request_name, user_request_tel: l.user_request_tel, receive_date: l.receive_date, receive_time_first: l.receive_time_first,
                                                            send_to: l.send_to, send_time_first: l.send_time_first, send_tel: l.send_tel, task_group: l.task_group, task_group_document: l.task_group_document, task_group_quantity: l.task_group_quantity, receive_from: l.receive_from,
                                                            comment: l.comment, send_date: l.send_date, refresion: this._Re_worklist_query
                                                        })}>
                                                        <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                                                    </Button>
                                                </Right>
                                            </ListItem>
                                        ))
                                    }
                                </View> */}

                        {/* </Content> : <View style={{ flex: 1 }} />} */}

                        {/* {
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
                                } else if (this.state.specialJob.length == 0 && this.state.showTable.length == 0) {
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
                        } */}
                    </Tab>
                </Tabs>
            </Container >


        );
    }

    /**
     * FlatList สำหรับตรวจงาน
     */
    renderCheckJob = (item, index) => {
        const { navigate } = this.props.navigation
        return <ListItem style={{ paddingLeft: normalize(10), marginLeft: 0 }} >
            <CheckBox value={this.state.CF_ALL_INVOICE[index]} onValueChange={() => this.onValueChange(item, index)} />
            <Body style={{ marginLeft: normalize(3) }}>
                <View style={{ left: 0, right: 0, top: 0, bottom: 0, }}>
                    <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                        onPress={() => navigate('CheckWork', { id: item.invoiceNumber, NumBox: item.NumBox, refresion: this._Re_worklist_query, receive_success: 0 })}
                    >
                        <Text style={styles.storeLabel}>{index + 1}). {item.invoiceNumber}</Text>
                        <Text style={{ fontSize: normalize(16) }} numberOfLines={1}>{item.DELIVERYNAME}</Text>
                    </TouchableOpacity>
                </View>
            </Body>
            <Right>
                <Button transparent onPress={() => navigate('CheckWork', { id: item.invoiceNumber, NumBox: item.NumBox, refresion: this._Re_worklist_query, receive_success: 0 })}>
                    <Text style={styles.storeLabel}>{item.NumBox}/{item.QtyBox}</Text>
                    <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                </Button>
            </Right>
        </ListItem>
    }


    /**
     * FlatList สำหรับตรวจงานแล้ว
     */
    renderReceive = (item, index) => {
        const { navigate } = this.props.navigation
        return <ListItem noIndent style={{ backgroundColor: "#A9FC93", marginLeft: 0, paddingLeft: normalize(10) }}>
            <Body style={{ marginLeft: normalize(3) }}>
                <TouchableOpacity style={{ left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center' }}
                    onPress={() => navigate('CheckWork', { id: item.invoiceNumber, NumBox: item.NumBox, refresion: this._Re_worklist_query, receive_success: 1 })}
                >
                    <Text style={styles.storeLabel}>{index + 1}). {item.invoiceNumber}</Text>
                    <Text style={{ fontSize: normalize(16) }} numberOfLines={1}>{item.DELIVERYNAME}</Text>
                </TouchableOpacity>
            </Body>
            <Right>
                <Button transparent onPress={() => navigate('CheckWork', { id: item.invoiceNumber, NumBox: item.NumBox, refresion: this._Re_worklist_query, receive_success: 1 })}>
                    <Text style={styles.storeLabel}>{item.NumBox}/{item.QtyBox}</Text>
                    <Icon name='ios-arrow-forward' style={{ color: 'gray' }} />
                </Button>
            </Right>
        </ListItem>
    }

    /**
     * Footer Tab [Work]
     */
    renderFooterWork() {
        let { showTable, CF_ALL_INVOICE, specialJob } = this.state
        if (showTable.length > 0) {
            return (
                <TouchableOpacity
                    disabled={this.state.refreshing_1}
                    onPress={() => {
                        if (CF_ALL_INVOICE.every(this.checkDATA)) {
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
                    }}>
                    <Footer style={{
                        backgroundColor: '#ff6c00',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ตรวจงานทั้งหมด</Text>
                    </Footer>

                </TouchableOpacity>
            )
        } else if (showTable.length == 0 && specialJob.length == 0) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'ยืนยันการออกรอบ',
                            'คุณต้องการออกรอบเลยหรือไม่?',
                            [
                                { text: 'ยกเลิก', onPress: () => console.log("no") },
                                { text: 'ยืนยัน', onPress: () => { this.checkpending(1) } },
                            ]
                        )
                    }}>
                    <Footer style={{
                        backgroundColor: '#33CC33',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: 'white', fontFamily: font.semi, fontSize: normalize(20) }}>ส่งงาน</Text>
                    </Footer>
                </TouchableOpacity>
            )
        }
    }
}

const GraphQL = compose(HomeTab)
export default withApollo(GraphQL)

const querywork_DL = gql`
    query querywork_DL($MessengerID:String!){
        querywork_DL(MessengerID: $MessengerID){
            invoiceNumber
            customerName
            DELIVERYNAME
            QtyBox
            NumBox
            id
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

const confirmworksomeAll_DL = gql`
    mutation confirmworksomeAll_DL($invoiceNumber:String!,$numBox:String!,$MessengerID:String!){
        confirmworksomeAll_DL(invoiceNumber: $invoiceNumber,numBox:$numBox,MessengerID:$MessengerID){
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    storeLabel: {
        fontSize: normalize(18),
        color: 'black'
    },
    detailContent: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRightWidth: Math.floor(normalize(2)),
        borderLeftWidth: Math.floor(normalize(2)),
        borderTopWidth: Math.floor(normalize(1)),
        borderBottomWidth: Math.floor(normalize(1)),
        height: normalize(50),
        justifyContent: 'center'
    },
    detailContentGREEN: {
        width: Dimensions.get('window').width,
        borderColor: 'gray',
        borderRightWidth: Math.floor(normalize(2)),
        borderLeftWidth: Math.floor(normalize(2)),
        borderTopWidth: Math.floor(normalize(1)),
        borderBottomWidth: Math.floor(normalize(1)),
        height: normalize(50),
        justifyContent: 'center',
        backgroundColor: '#77F156'
    },
    horizontal: {
        flexDirection: 'row',
        padding: normalize(10),
        justifyContent: "center"
    }
})